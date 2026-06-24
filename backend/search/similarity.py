from products.models import Product
from pgvector.django import CosineDistance

class SimilarityEngine:
    @staticmethod
    def search_similar_products(query_embedding: list, limit: int = 20, query_text: str = None):
        """
        Uses pgvector's CosineDistance to find products with embeddings closest to the query_embedding.
        Returns the top `limit` results annotated with a 'similarity_score'.
        If query_text is provided, performs a hybrid re-ranking to boost exact keyword matches.
        """
        # Fetch more candidates if we are going to re-rank
        fetch_limit = 100 if query_text else limit
        
        products = Product.objects.annotate(
            distance=CosineDistance('embedding', query_embedding)
        ).order_by('distance')[:fetch_limit]
        
        # Convert QuerySet to list for python-level processing
        results = list(products)
        
        if query_text:
            query_lower = query_text.lower()
            query_words = set(query_lower.split())
            
            # Detect intended demographic in the query
            query_is_kids = any(w in query_lower for w in ['kid', 'boy', 'girl', 'infant', 'toddler', 'baby', 'children'])
            # Note: handle cases where 'boy' or 'girl' is used, they shouldn't trigger adult men/women
            query_is_women = any(w in query_lower for w in ['women', 'woman', 'lady', 'ladies'])
            query_is_men = any(w in query_lower for w in ['men', 'man', 'male'])
            
            for p in results:
                # Combine name and category for text matching
                cat_name = p.category.name.lower() if p.category else ''
                text_to_search = f"{p.name} {cat_name}".lower()
                text_words = set(text_to_search.split())
                
                # Boost based on exact keyword overlap
                match_count = len(query_words.intersection(text_words))
                
                if hasattr(p, 'distance') and p.distance is not None:
                    # Decrease distance (increase similarity) for each exact word matched.
                    p.distance = max(0.0, float(p.distance) - (match_count * 0.15))
                    
                    # Apply heavy penalties for demographic mismatches
                    if query_is_kids and cat_name in ['men', 'women']:
                        p.distance += 0.4
                    elif query_is_women and not query_is_men and cat_name == 'men':
                        p.distance += 0.4
                    elif query_is_men and not query_is_women and cat_name == 'women':
                        p.distance += 0.4
                    
            # Re-sort based on adjusted distance
            results = sorted(results, key=lambda x: x.distance if x.distance is not None else 2.0)
            
        # Slice to final limit
        results = results[:limit]

        # Calculate final similarity score percentage
        final_results = []
        for p in results:
            dist = float(p.distance) if p.distance is not None else 2.0
            similarity = max(0.0, 1.0 - dist)
            p.similarity_score = round(similarity * 100, 2)
            final_results.append(p)
            
        return final_results

    @staticmethod
    def combine_embeddings(text_emb: list, image_emb: list, text_weight: float = 0.5) -> list:
        """
        Combines a text embedding and an image embedding for Hybrid Search.
        """
        import numpy as np
        
        t = np.array(text_emb)
        i = np.array(image_emb)
        
        # Weighted sum
        combined = (text_weight * t) + ((1.0 - text_weight) * i)
        
        # Re-normalize
        combined_norm = np.linalg.norm(combined)
        if combined_norm > 0:
            combined = combined / combined_norm
            
        return combined.tolist()
