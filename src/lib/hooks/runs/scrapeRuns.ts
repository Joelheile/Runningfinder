
export async function scrapeRuns() {
  const results = await fetch('/api/runs/scrape', {
    method: 'POST',
    body: JSON.stringify({
      siteUrl: 'https://runningfomo.com'
    })
  }).then(r => r.json())
  console.log('results', results)
  return results
}