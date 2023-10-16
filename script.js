'use strict'

// Get the appropriate ZIP code regex based on the country
const getZIPRegex = country => {
  switch (country) {
    case 'USA':
    case 'Italy':
    case 'France':
    case 'Germany':
    case 'Spain':
      return /\b\d{5}\b/
    case 'Canada':
      return /\b[A-Z]\d[A-Z]\s\d[A-Z]\d\b/
    case 'UK':
    case 'United Kingdom':
      return /\b[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2,}\b/
    case 'Australia':
      return /\b\d{4}\b/
    case 'Japan':
      return /\b\d{3}-\d{4}\b/
    default:
      return /.*/ // Default regex, matches anything
  }
}

// Fetch and extract ZIP code from the API response
const fetchAndExtractZIP = async (address, city, country, zipRegex) => {
  const encodedAddress = encodeURIComponent(address)
  const encodedCountry = encodeURIComponent(country)
  const encodedCity = encodeURIComponent(city)
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?street=${encodedAddress}&city=${encodedCity}&country=${encodedCountry}&format=json`
  )
  const data = await response.json()

  let zipCode = 'Not Found'
  if (data.length > 0) {
    for (const candidate of data) {
      console.log(candidate.display_name)
      const matches = candidate.display_name.match(zipRegex)
      if (matches) {
        zipCode = matches[0]
        break
      }
    }
  }

  return zipCode
}

// Append a row to the table
const appendRowToTable = (tableBody, address, zipCode) => {
  const newRow = tableBody.insertRow()
  newRow.insertCell(0).innerText = address
  newRow.insertCell(1).innerText = zipCode
}

// Fetch ZIP codes based on country
const fetchZIPCodes = async () => {
  const country = document.getElementById('countryInput').value
  const city = document.getElementById('cityInput').value
  let addresses = document.getElementById('addressInput').value.split('\n')

  // Filter out empty addresses
  addresses = addresses.filter(address => address.trim() !== '')

  const tableBody = document
    .getElementById('resultsTable')
    .getElementsByTagName('tbody')[0]
  tableBody.innerHTML = ''

  const zipRegex = getZIPRegex(country)

  for (const address of addresses) {
    const zipCode = await fetchAndExtractZIP(address, city, country, zipRegex)

    appendRowToTable(tableBody, address, zipCode)
  }
}
