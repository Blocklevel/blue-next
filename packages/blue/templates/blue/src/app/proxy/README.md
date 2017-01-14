# Proxy directory

### What is a proxy
In short, a proxy is a wrapper that is being called to access the real serving object behind the scenes. Proxies are used to act as an interface for server requests, this is quite useful to mock server requests and responses.  

### Example
``` javascript
import Vue from 'vue'
import _ from 'lodash'

/**
 * Configuration
 */
const base = 'https://api.openweathermap.org/data/2.5/'
const API_KEY = '16382cd4b642502e91a2ea7c618f6ff4'

/**
 * Retrieve a weather forecast
 */
export function getWeatherForecast(filters) {
  const query = filters.join(',')

  return Vue.http.get(`${base}weather?q=${query}&API_KEY=${API_KEY}`)
}
```

### Conventions
- A proxy should make calls to a store
