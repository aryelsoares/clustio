# Constants

# Decimal places
ROUND_VALUE = 2

# Cluster amount
MIN_K = 2
MAX_K = 10

# Model configs
HIERARCHICAL_METHODS = ["ward", "complete", "average"]
OPTICS_XIS = [0.03, 0.05, 0.1]
OPTICS_MIN_K_SIZES = [0.05, 0.1, 0.2]
GMM_COVS = ["full", "tied", "diag", "spherical"]
SPECTRAL_AFFINITIES = ["rbf", "nearest_neighbors"]
SPECTRAL_GAMMAS = [0.1, 0.5, 1.0]