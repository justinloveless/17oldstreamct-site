/**
 * Handler for content/facts.json
 * 
 */
export function handle(data) {
  if (!data) return;

  const interiorFacts = document.getElementById('interior-facts');
  const propertyFacts = document.getElementById('property-facts');
  const constructionFacts = document.getElementById('construction-facts');
  const financialFacts = document.getElementById('financial-facts');

  interiorFacts.innerHTML = data.interior.map(fact => `<li><strong>${fact.label}:</strong> ${fact.value}</li>`).join('');
  propertyFacts.innerHTML = data.property.map(fact => `<li><strong>${fact.label}:</strong> ${fact.value}</li>`).join('');
  constructionFacts.innerHTML = data.construction.map(fact => `<li><strong>${fact.label}:</strong> ${fact.value}</li>`).join('');
  financialFacts.innerHTML = data.financial.map(fact => `<li><strong>${fact.label}:</strong> ${fact.value}</li>`).join('');
}


