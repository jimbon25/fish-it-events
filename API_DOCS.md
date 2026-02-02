# 🔌 API Documentation - Fish It Roblox

## GitHub REST API Integration

### Endpoints yang Digunakan

#### 1. **GET - Fetch Events**

Membaca file `events.json` dari GitHub repository.

```
GET https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{FILE_PATH}
```

**Contoh:**
```
GET https://raw.githubusercontent.com/username/fish-it-events/main/events.json
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "🎣 Fishing Competition",
    "date": "2026-02-08",
    "description": "Kompetisi fishing...",
    "reward": "1st Place: 500 Robux\n2nd Place: 300 Robux"
  }
]
```

**Rate Limit:** 60 requests/hour (unauthenticated)

---

#### 2. **PUT - Update Events**

Update file `events.json` di repository.

```
PUT https://api.github.com/repos/{OWNER}/{REPO}/contents/{FILE_PATH}
```

**Headers:**
```
Authorization: token {GITHUB_TOKEN}
Accept: application/vnd.github.v3+json
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Update events",
  "content": "{BASE64_ENCODED_CONTENT}",
  "sha": "{FILE_SHA}",
  "branch": "main"
}
```

**Response:**
```json
{
  "content": {
    "sha": "7d8cfe...",
    "name": "events.json",
    "path": "events.json",
    "size": 523,
    "type": "file",
    "url": "https://api.github.com/repos/.../events.json",
    "html_url": "https://github.com/..."
  },
  "commit": {
    "sha": "95d5ba...",
    "message": "Update events",
    "author": {...}
  }
}
```

---

### JavaScript Function Reference

#### `fetchEvents()`

Fetch events dari GitHub (di `script.js`).

```javascript
const events = await fetchEvents();
// Returns: Array<Event>
```

**Behavior:**
- Fetch dari GitHub raw URL
- Jika gagal, gunakan fallback data
- Auto-cache di localStorage

---

#### `fetchEventsFromGitHub()`

Fetch events untuk admin (di `admin.js`).

```javascript
const events = await fetchEventsFromGitHub();
// Returns: Array<Event>
```

**Behavior:**
- Fetch dari GitHub dengan caching
- Gunakan cached data jika offline
- Log ke console

---

#### `saveEventsToGitHub(events)`

Save events ke GitHub (di `admin.js`).

```javascript
await saveEventsToGitHub(events);
// Returns: Promise<boolean>
```

**Parameters:**
- `events` (Array<Event>): Array of events to save

**Process:**
1. Get GitHub token dari environment variable
2. Encode JSON ke base64
3. Fetch current file SHA
4. PUT dengan updated content & SHA
5. Return success status

**Error Handling:**
- Throw error jika token tidak ada
- Throw error jika API request gagal
- Show status message di UI

---

### Event Object Structure

```typescript
interface Event {
  id: number;              // Unique ID (timestamp-based)
  title: string;           // Event title with emoji
  date: string;            // ISO 8601 format (YYYY-MM-DD)
  description: string;     // Event description
  reward: string;          // Prize/reward info (multiline)
}
```

**Contoh:**
```json
{
  "id": 1644326400000,
  "title": "🎣 Fishing Competition",
  "date": "2026-02-08",
  "description": "Kompetisi fishing terbesar bulan ini!",
  "reward": "1st Place: 500 Robux\n2nd Place: 300 Robux\n3rd Place: 100 Robux"
}
```

---

### Environment Variables

#### `GITHUB_TOKEN`

Personal Access Token untuk GitHub API.

**Setup:**
1. Generate di: https://github.com/settings/tokens
2. Permission: `repo` (full control)
3. Set di Vercel environment variables

**Usage:**
```javascript
const token = process.env.GITHUB_TOKEN;
// atau dari localStorage untuk testing
const token = localStorage.getItem('github_token');
```

---

### Error Handling

#### Network Errors

```javascript
try {
  const events = await fetchEvents();
} catch (error) {
  console.error('Network error:', error);
  // Fallback ke cached data atau default
}
```

#### GitHub API Errors

```javascript
try {
  await saveEventsToGitHub(events);
} catch (error) {
  // error.message: "GitHub API error: Not Found"
  showStatus(`❌ Error: ${error.message}`, 'error');
}
```

#### Authentication Errors

```javascript
if (!getGitHubToken()) {
  showStatus('❌ GitHub token tidak ditemukan', 'error');
  return;
}
```

---

### Rate Limiting

**GitHub API Limits:**
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

**Optimization:**
- Gunakan authenticated requests (set token)
- Cache events di localStorage
- Revalidate setiap 5 menit

**Check Rate Limit:**
```
GET https://api.github.com/rate_limit
Authorization: token {GITHUB_TOKEN}
```

---

### Base64 Encoding/Decoding

**Encode JSON to Base64:**
```javascript
const json = JSON.stringify(events, null, 2);
const encoded = btoa(json);
```

**Decode Base64 to JSON:**
```javascript
const encoded = "eyJpZCI6IjEiLCJ0aXRsZSI6IkZpc2gifQ==";
const json = atob(encoded);
const events = JSON.parse(json);
```

---

### Security Considerations

#### Token Security
- ✅ Set token di environment variable (Vercel)
- ❌ JANGAN hardcode token di code
- ❌ JANGAN commit token ke Git
- ✅ Rotate token secara berkala

#### Input Validation
- ✅ Validate form input
- ✅ Escape HTML untuk prevent XSS
- ✅ Check JSON structure
- ✅ Validate date format

#### API Security
- ✅ Use HTTPS only
- ✅ Limit token permissions
- ✅ Monitor API usage
- ✅ Setup rate limiting

---

### Testing

#### Test Fetch dari GitHub

```javascript
// Console test
const events = await fetchEvents();
console.log(events);
```

#### Test Localhost

Set GitHub token di localStorage:

```javascript
// Console
localStorage.setItem('github_token', 'ghp_xxxxxxxxxxxx');
```

Refresh page dan test admin dashboard.

#### Test tanpa Network

Events akan di-load dari fallback data:

```javascript
// script.js
const fallbackEvents = CONFIG.FALLBACK_EVENTS;
```

---

### Troubleshooting API Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | URL salah atau file tidak ada | Verify GitHub username & repo name |
| 401 Unauthorized | Token invalid atau expired | Regenerate GitHub token |
| 422 Unprocessable | SHA tidak match | Refetch latest SHA dari GitHub |
| 403 Forbidden | Token permission tidak cukup | Add `repo` permission |
| 429 Too Many Requests | Rate limit exceeded | Wait 1 hour atau use authenticated |

---

### API Flow Diagram

```
Landing Page (script.js)
    ↓
fetch events dari GitHub
    ↓
Render events cards
    ↓
Display ke user

Admin Dashboard (admin.js)
    ↓
Login verify
    ↓
Fetch current events
    ↓
User add/delete event
    ↓
Encode JSON → base64
    ↓
PUT ke GitHub API
    ↓
Update events.json
    ↓
Return success
```

---

### References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub API - Contents](https://docs.github.com/en/rest/repos/contents)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Base64 Encoding MDN](https://developer.mozilla.org/en-US/docs/Glossary/Base64)

---

**Happy Coding! 🚀**
