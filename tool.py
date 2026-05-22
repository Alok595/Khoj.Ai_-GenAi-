from langchain.tools import tool
import requests

from bs4 import BeautifulSoup


from tavily import TavilyClient
from dotenv import load_dotenv
load_dotenv()
import os

from rich import print


tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def web_search(query:str)->str:
  """Search The Web For Recent And Reliable Information on a topic . Returns Titles ,URLs and snippets"""

  result=tavily.search(
        query,
        max_results=5,
       )
  
  out=[]

  for r in result["results"]:
    out.append(
    f"Title: {r['title']}\n"
    f"URL: {r['url']}\n"
    f"Snippet: {r['content'][:300]}\n"
)
  return "\n----\n".join(out)





@tool
def scrape_url(url:str)->str:

  """Scrap and return clean text content from a given URL for a deeprt reading"""


  try:
      
      response = requests.get(url, timeout=8,headers={"User-Agent":"Mozilla/5.0"})

      soup = BeautifulSoup(response.text, "html.parser")
      for tag in soup(["script","style","nav","footer"]):
         tag.decompose()
      return soup.get_text(separator=" ",strip=True)[:3000]
  except Exception as e:
     return f"Cloud not scrape URL:{str(e)}"

     


# print(scrape_url.invoke("https://www.aljazeera.com/news/liveblog/2026/3/26/iran-war-live-us-demands-tehran-accept-defeat-israel-pounds-lebanon"))


    



  






