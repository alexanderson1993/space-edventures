# Loaders

Loaders are collection-specific data loaders than can batch and cache data from various Firebase sources. This will decrease the load on Firebase (decreasing costs) and increase response times for requests that have to aggregate data from sources multiple times or data that changes infrequently.

DataLoader recommends that the cache is cleared for every request. Fortunately, this is handled automatically by Firebase Functions, because the function is allegedly cleared every time the function is called. This will have to be verified.

One constraint of DataLoader is that the data that is returned must exactly match the length and order of the array which was provided to the batch function. See here: https://github.com/facebook/dataloader#batch-function
