# Google Meet MCP Server

**Bring Google Meet meeting management and conference analytics into your AI workflows.**

A Model Context Protocol (MCP) server that exposes Google Meet's API for creating, managing, and analyzing meeting spaces and conference records—all accessible through Claude Desktop and other MCP clients.

---

## Overview

The Google Meet MCP Server provides stateless, multi-user access to Google Meet's core operations:

- **Meeting Space Management** — Create, retrieve, update, and end virtual meeting spaces
- **Conference Analytics** — Access detailed conference records, participant data, and session history
- **Participant Tracking** — Query participant details and session information

Perfect for:

- Automated meeting scheduling and lifecycle management
- Post-meeting analytics and reporting
- Building AI-driven meeting orchestration tools

**Supported Clients:** Claude Desktop, MCP-compatible tools over HTTP/SSE

---

## Quick Start (Local Setup)

### Prerequisites

- **Python 3.10+**
- **pip** package manager
- **Google Cloud project** with Google Meet API enabled
- **OAuth 2.0 credentials** (Service Account or User Account)

### 1. Install Dependencies

```bash
cd /home/stark/Code/Curious Layer/CL-RAG
pip install fastmcp pydantic google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### 2. Set Up OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Meet API**
4. Create OAuth 2.0 credentials:
   - For CLI/local: Create a **Desktop** application
   - Download the credentials JSON file
5. Save as `google_meet_credentials.json` in your project root

### 3. Environment Setup

```bash
export GOOGLE_MEET_CREDENTIALS_PATH="/path/to/google_meet_credentials.json"
export MCP_TRANSPORT="stdio"  # or "streamable-http"
```

### 4. Run the Server

```bash
python MEWCP/SERVER_STRUCTURE.py --transport stdio
```

For HTTP mode:

```bash
python MEWCP/SERVER_STRUCTURE.py --transport streamable-http --host 0.0.0.0 --port 8000
```

### 5. Configure Claude Desktop

Create or edit `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-meet": {
      "command": "python",
      "args": [
        "/home/stark/Code/Curious Layer/CL-RAG/MEWCP/SERVER_STRUCTURE.py",
        "--transport",
        "stdio"
      ],
      "env": {
        "GOOGLE_MEET_CREDENTIALS_PATH": "/path/to/google_meet_credentials.json"
      }
    }
  }
}
```

Restart Claude Desktop to load the server.

---

## Tool Reference

### Meeting Space Management

#### `create_meeting_space`

**Create a new Google Meet meeting space**

**Inputs:**

- `oauth_token` (string, required) — Valid Google OAuth token with Meet API scopes

**Outputs:**

```json
{
  "result": "Space resource details including ID and meeting link"
}
```

**Example:**

```json
{
  "tool": "create_meeting_space",
  "input": {
    "oauth_token": "ya29.a0AfH6SMB..."
  }
}
```

---

#### `get_meeting_space`

**Retrieve details for a Google Meet meeting space**

**Inputs:**

- `name` (string, required) — Space resource name, e.g., `spaces/abc-defg-hij`
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Space configuration and metadata"
}
```

**Example:**

```json
{
  "tool": "get_meeting_space",
  "input": {
    "name": "spaces/abc-defg-hij",
    "oauth_token": "ya29.a0AfH6SMB..."
  }
}
```

---

#### `update_meeting_space`

**Update a Google Meet meeting space**

**Inputs:**

- `name` (string, required) — Space resource name, e.g., `spaces/abc-defg-hij`
- `update_mask` (string, required) — Comma-separated field mask, e.g., `config.access_settings,display_settings`
- `space` (string, required) — JSON string body with updated fields
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Updated space configuration"
}
```

**Example:**

```json
{
  "tool": "update_meeting_space",
  "input": {
    "name": "spaces/abc-defg-hij",
    "update_mask": "config.access_settings",
    "space": "{\"config\": {\"access_settings\": {\"access_level\": \"OPEN\"}}}",
    "oauth_token": "ya29.a0AfH6SMB..."
  }
}
```

---

#### `end_meeting_space`

**End a Google Meet meeting space**

**Inputs:**

- `name` (string, required) — Space resource name, e.g., `spaces/abc-defg-hij`
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Confirmation of space termination"
}
```

---

### Conference Records & Analytics

#### `get_conference_record`

**Retrieve a Google Meet conference record**

**Inputs:**

- `name` (string, required) — Conference record resource name, e.g., `conferenceRecords/abc123def456`
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Conference metadata including start time, duration, participant count"
}
```

---

#### `list_conference_records`

**List Google Meet conference records**

**Inputs:**

- `page_size` (integer, optional) — Max items per page (default: null)
- `page_token` (string, optional) — Pagination token from previous response
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Array of conference records with pagination info"
}
```

**Example:**

```json
{
  "tool": "list_conference_records",
  "input": {
    "page_size": 10,
    "oauth_token": "ya29.a0AfH6SMB..."
  }
}
```

---

### Participant Management

#### `get_participant`

**Get a participant from a Google Meet conference record**

**Inputs:**

- `name` (string, required) — Participant resource name
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Participant details (name, email, join/leave times)"
}
```

---

#### `list_participants`

**List participants from a Google Meet conference record**

**Inputs:**

- `parent` (string, required) — Parent conference record resource name, e.g., `conferenceRecords/abc123`
- `page_size` (integer, optional) — Max items per page
- `page_token` (string, optional) — Pagination token
- `filter` (string, optional) — API filter expression
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Array of participants with optional filtering"
}
```

---

#### `get_participant_session`

**Get a participant session by ID**

**Inputs:**

- `name` (string, required) — Participant session resource name
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Session details including start/end time and status"
}
```

---

#### `list_participant_sessions`

**List participant sessions**

**Inputs:**

- `parent` (string, required) — Parent participant resource name
- `page_size` (integer, optional) — Max items per page
- `page_token` (string, optional) — Pagination token
- `filter` (string, optional) — API filter expression
- `oauth_token` (string, required) — Valid Google OAuth token

**Outputs:**

```json
{
  "result": "Array of participant sessions"
}
```

---

## Integration Examples

### Claude Desktop Example

```
User: "Create a new Google Meet space and tell me the details"

Claude uses:
→ create_meeting_space(oauth_token)
→ Returns: Space ID, meeting link
→ Displays: "✓ Meeting created: meet.google.com/abc-defg-hij"
```

### Automated Reporting Example

```python
# List all conferences from the past week
list_conference_records(page_size=50)

# For each conference, get participants
list_participants(parent=conferenceId, page_size=100)

# Generate report with attendee analytics
```

### HTTP/SSE Integration

```bash
# Start server in HTTP mode
python MEWCP/SERVER_STRUCTURE.py --transport streamable-http --port 8000

# Call tool via HTTP
curl -X POST http://localhost:8000/tools/list_conference_records \
  -H "Content-Type: application/json" \
  -d '{"page_size": 10}'
```

---

## Troubleshooting

### **"Invalid OAuth Token" Error**

- **Cause:** Token expired or invalid scopes
- **Solution:**
  1. Re-authenticate with Google account
  2. Ensure scopes include:
     - `https://www.xyxapi.com/auth/meetings.space.created`
     - `https://www.xyxapi.com/auth/meetings.space.readonly`

### **"Permission Denied" Error**

- **Cause:** Insufficient permissions on the meeting space
- **Solution:**
  - Verify you have owner/editor access to the space
  - Check Google Cloud IAM permissions

### **"404 – Space Not Found" Error**

- **Cause:** Invalid space resource name or space was deleted
- **Solution:**
  - Confirm space ID format: `spaces/abc-defg-hij`
  - Use `list_conference_records` to verify valid resources

### **Connection Issues**

- **Port already in use:**
  ```bash
  lsof -i :8000
  kill -9 <PID>
  ```
- **Python version mismatch:**
  ```bash
  python --version  # Ensure 3.10+
  ```
- **Firewall blocking HTTP:**
  - Allow port 8000 in your firewall settings
  - Use stdio transport for local development

---

## API Parameters Reference

### Common Pagination Parameters

| Parameter    | Type    | Description                  | Example           |
| ------------ | ------- | ---------------------------- | ----------------- |
| `page_size`  | integer | Max results per page (1–100) | `25`              |
| `page_token` | string  | Token from previous response | `"next_page_123"` |
| `filter`     | string  | CEL filter expression        | `"status=ACTIVE"` |

### Space Resource Format

```
spaces/{SPACE_ID}
Example: spaces/abc-defg-hij
```

### Conference Record Resource Format

```
conferenceRecords/{RECORD_ID}
Example: conferenceRecords/abc123def456ghi789
```

### Participant Resource Format

```
conferenceRecords/{RECORD_ID}/participants/{PARTICIPANT_ID}
Example: conferenceRecords/abc123/participants/xyz789
```

---

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit credentials** — Add `google_meet_credentials.json` to `.gitignore`

   ```bash
   echo "google_meet_credentials.json" >> .gitignore
   ```

2. **Use environment variables** — Store token paths and secrets in `.env`

   ```bash
   GOOGLE_MEET_CREDENTIALS_PATH="/secure/path/credentials.json"
   MCP_AUTH_TOKEN="your_secure_token"
   ```

3. **Token expiration** — OAuth tokens expire; implement refresh:

   ```python
   if token_expired():
       refresh_google_oauth_token()
   ```

4. **HTTPS in production** — Always use TLS/SSL:

   ```bash
   python SERVER_STRUCTURE.py --transport streamable-http --ssl-cert /path/to/cert.pem
   ```

5. **Least privilege** — Request only required OAuth scopes

---

## Architecture

The Google Meet MCP Server follows a **stateless, multi-user design**:

**Key Design Principles:**

- **No session storage** — Each request is independent
- **Horizontally scalable** — Run multiple instances without shared state
- **OAuth per-request** — Token passed with each tool call

---

## Resources

- **[Google Meet API Documentation](https://developers.google.com/meet/api/guides)** — Official API reference
- **[Google Cloud OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)** — Authentication setup
- **[Model Context Protocol Docs](https://modelcontextprotocol.io/)** — MCP specification
- **[FastMCP Documentation](https://github.com/jlowin/fastmcp)** — FastMCP framework guide

---

## Contributing & License

**We welcome contributions!**

- Report issues or request features via GitHub Issues
- Submit pull requests for bug fixes or enhancements
- Follow existing code style and add tests for new features

**License:** MIT

---
