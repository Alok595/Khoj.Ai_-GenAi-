Here is the conceptual blueprint and step-wise execution flow of your multi-agent research system, showing how the data moves from your configuration files down to your user interface.

---

## 🏗️ System Architecture & Data Flow

This diagram illustrates how data flows sequentially from the user's browser, down through the FastAPI server layer, across the specialized LangChain agents, and back up.

```text
       ┌────────────────────────────────────────────────────────┐
       │                  React UI (Vite)                       │
       │  [Input Topic] ──────────────────────> [Display Output]│
       └───────┬────────────────────────────────────▲───────────┘
               │ HTTP POST                          │ JSON
               ▼ /research                          │ Response
       ┌────────────────────────────────────────────┴───────────┐
       │                FastAPI Application                     │
       │  Pydantic Validation ───────────> JSON Construction    │
       └───────┬────────────────────────────────────▲───────────┘
               │ Topic String                       │ Python Dict
               ▼                                    │
 ┌──────────────────────────────────────────────────────────────┐
 │                  LangChain Pipeline Workspace                │
 │                                                              │
 │  Step 1: Search Agent ───────────────────────────────┐       │
 │  └─ Calls Tavily API -> Obtains 5 snippets & URLs     │       │
 │                                                      ▼       │
 │  Step 2: Reader Agent <──────────────────────────────┘       │
 │  └─ Picks best URL -> Extracts clean body text via BS4       │
 │                                                      │       │
 │  Step 3: Writer Chain <──────────────────────────────┘       │
 │  └─ Combines research -> Formats structured Markdown         │
 │                                                      ▼       │
 │  Step 4: Critic Chain ───────────────────────────────────────┘
 │  └─ Reviews Markdown -> Compiles scores & constructive edits
 └──────────────────────────────────────────────────────────────┘

```

---

## 🛠️ Step-by-Step Implementation Workflow

The system is built sequentially in seven distinct operational phases:

### Phase 1: Environmental Scoping (.env & requirements.txt)

* **Step 1:** The dependencies are anchored in requirements.txt. This locks down framework packages like langchain, network tool utilities like requests and tavily-python, text parsers like beautifulsoup4, and backend engines like fastapi and uvicorn.
* **Step 2:** The application secrets (MISTRAL_API_KEY and TAVILY_API_KEY) are isolated into a .env file to separate core configuration from active code execution logic.

### Phase 2: Building Runtime Tools (tool.py)

* **Step 3:** The **Web Search Tool** is defined. It instantiates the TavilyClient, receives queries directly from an agent, performs a live internet search, limits the results to five targets, and clean-formats them into string payloads containing titles, URLs, and text snippets.
* **Step 4:** The **Scrape Tool** is defined. It receives raw URLs, spoof-identifies its browser headers using standard user-agent signatures to bypass scrap blocks, strips layout noise like scripts, styles, or footers using BeautifulSoup, and slices text to protect the LLM context window limits.

### Phase 3: Cognitive Agent Assembly (agent.py)

* **Step 5:** The core LLM instance is created with temperature=0 to ensure highly objective, predictable responses from the underlying model.
* **Step 6:** The **Search Agent** and **Reader Agent** are initialized via LangChain's factory tools, explicitly binding the Search Tool to the first agent and the Scrape Tool to the second.
* **Step 7:** The **Writer Chain** and **Critic Chain** are structurally constructed using LCEL (LangChain Expression Language) pipes (Prompt | LLM | Parser). These declare strict persona frameworks and template layouts without giving them open-ended tool execution permissions.

### Phase 4: State Pipeline Orchestration (pipeline.py)

* **Step 8:** A centralized execution state dictionary (state = {}) is deployed to sequentially map out parameters downstream.
* **Step 9:** The Search Agent runs, pushing raw queries to internet engines and updating the system state with source lists.
* **Step 10:** The Reader Agent reviews the search payload, isolates the single highest quality web location, reads the text content via the scraping tool, and appends it back to the active execution state.
* **Step 11:** The Writer and Critic chains execute in sequence—the writer generating clean markdown documentation, and the critic measuring structural performance to build a finalized analysis file.

### Phase 5: Network Microservice Layer (main.py)

* **Step 12:** An asynchronous FastAPI instance is declared, opening up server endpoints to listen to outside browser traffic.
* **Step 13:** A Pydantic schema verification class checks inbound network requests to confirm the string matches the input rules.
* **Step 14:** Cross-Origin Resource Sharing (CORS) rules are injected into the server, enabling secure communications with the localized browser environment.
* **Step 15:** A POST route handler listens to endpoints, passes inbound parameters to your underlying LangChain state orchestrator, waits for execution to complete, and sends structured JSON outputs back to the consumer.

### Phase 6: Interactive Interface Connection (App.jsx)

* **Step 16:** A modern React user dashboard uses functional component hooks (useState) to lock input tracking values, process loader events, and store server payload blocks.
* **Step 17:** An active event trigger intercepts submit actions, executing network transactions (fetch / axios) against your backend endpoints.
* **Step 18:** Layout panels split raw text payloads dynamically across screen real estate—organizing markdown research documents, isolating critique metrics, and embedding collapsible raw content logs into an organized dashboard.



Here is a clean, practical **Setup & Installation Guide** section designed specifically for your README.md. It matches your step-wise format perfectly and gives clear directions on how to get the whole system up and running.

---

## ⚙️ Step-by-Step Setup & Execution Guide

Follow these steps to configure your environment, initialize the backend microservice, and launch your React user interface.

### Phase 1: Backend Environment Configuration

1. **Clone & Navigate:** Open your terminal, navigate to your root project folder where your backend files (main.py, pipeline.py, agent.py, tool.py) live.
2. **Create a Virtual Environment:** Isolate your project dependencies from your global python setup by running:
```bash
python -m venv venv


```



```
3. **Activate the Environment:** 
   * **macOS / Linux:** source venv/bin/activate
   * **Windows:** venv\Scripts\activate
4. **Install Core Requirements:** Install all required LLM orchestration libraries, web scrapers, and API server tools directly from your file:
   ```bash
   pip install -r requirements.txt
   

```

5. **Populate API Secrets:** Create a file named .env in the root of this backend directory and paste your respective platform access tokens:
```env
MISTRAL_API_KEY="your_actual_mistral_key_here"
TAVILY_API_KEY="your_actual_tavily_key_here"


```



```

### Phase 2: Starting the FastAPI Server

6. **Boot the Network API:** Fire up the high-performance Uvicorn server to listen for front-end requests. Execute this command in your active terminal:
   ```bash
   uvicorn main:app --reload --port 8000
   

```

7. **Verify the Endpoint Logs:** Your terminal should output a local server confirmation. You can access the interactive API playground documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to test out the endpoints manually.

### Phase 3: Launching the React Frontend Interface

8. **Navigate to UI Root:** Open a separate terminal window and move into your React application directory (where your package.json file is located).
9. **Install Packages:** Download and install the browser application node modules by running:
```bash
npm install


```



```
10. **Boot the UI Dev Server:** Start up the Vite development server to launch your web visualization interface:
    ```bash
    npm run dev
    

```

11. **Run Your First Search:** Open your browser and navigate to the local address displayed in your terminal terminal (typically http://localhost:5173). Type a topic into the prompt dashboard input box, click **"Execute Run"**, and follow along with your terminal logs to watch your agents collaborate in real-time.