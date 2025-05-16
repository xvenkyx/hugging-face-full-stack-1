from sklearn.feature_extraction.text import CountVectorizer
from sklearn.cluster import KMeans

def cluster_tags(tag_lists):
    tag_strings = [" ".join(tags) for tags in tag_lists]
    vectorizer = CountVectorizer(binary=True)
    tag_matrix = vectorizer.fit_transform(tag_strings)

    model = KMeans(n_clusters=2, random_state=42)
    labels = model.fit_predict(tag_matrix)
    return len(set(labels))  # number of clusters formed
