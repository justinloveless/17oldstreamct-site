/**
 * Handler for property.json asset
 * Populates property information on the page
 */
export function handle(data) {
  if (!data) return;

  // Update address
  const addressEl = document.querySelector('.address');
  if (addressEl && data.address) {
    addressEl.textContent = data.address;
  }

  // Update location
  const locationEl = document.querySelector('.location');
  if (locationEl && data.location) {
    locationEl.textContent = data.location;
  }

  // Update price
  const priceEl = document.querySelector('.price');
  if (priceEl && data.price) {
    priceEl.textContent = data.price;
  }

  // Update Zillow links
  const zillowLinks = document.querySelectorAll('.zillow-link, .contact-zillow');
  zillowLinks.forEach(link => {
    if (data.zillowUrl) {
      link.href = data.zillowUrl;
    }
  });

  // Populate property details
  if (data.details) {
    const details = data.details;
    const detailItems = document.querySelectorAll('.detail-item');
    
    detailItems.forEach(item => {
      const label = item.querySelector('.detail-label');
      if (!label) return;
      
      const labelText = label.textContent.trim();
      const value = item.querySelector('.detail-value');
      if (!value) return;
      
      if (labelText.includes('Bedrooms')) {
        value.textContent = details.bedrooms || '';
      } else if (labelText.includes('Bathrooms')) {
        value.textContent = details.bathrooms || '';
      } else if (labelText.includes('Square Feet')) {
        value.textContent = details.squareFeet || '';
      } else if (labelText.includes('Lot Size')) {
        value.textContent = details.lotSize || '';
      } else if (labelText.includes('Year Built')) {
        value.textContent = details.yearBuilt || '';
      } else if (labelText.includes('Price/sqft')) {
        value.textContent = details.pricePerSqft || '';
      }
    });
  }
}
