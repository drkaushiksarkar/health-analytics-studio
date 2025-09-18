import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle } from 'lucide-react';

export default function HelpDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl lg:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Setup & Matrox Migration Guide</SheetTitle>
          <SheetDescription>
            Your guide to setting up, configuring, and deploying the
            DiseaseVision application.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Tabs defaultValue="setup">
            <TabsList className="grid w-full grid-cols-3 mb-4 h-auto flex-wrap">
              <TabsTrigger value="setup">Setup (Local)</TabsTrigger>
              <TabsTrigger value="config">Config (.env)</TabsTrigger>
              <TabsTrigger value="run">Run & Service</TabsTrigger>
              <TabsTrigger value="proxy">Reverse Proxy</TabsTrigger>
              <TabsTrigger value="firewall">Firewall</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
              <TabsTrigger value="matrox" className="col-span-3">Matrox G200eW3 Migration</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="prose prose-sm max-w-none">
<pre className="bg-gray-100 p-4 rounded-md"><code>
### 1. System Prerequisites (Ubuntu/Debian)

Install `curl`, `git`, and `unzip`:
```bash
sudo apt-get update
sudo apt-get install -y curl git unzip
```

### 2. Install Node.js (LTS)

We'll use `nvm` (Node Version Manager) to avoid permission issues.
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
Re-open your terminal, then install Node.js LTS:
```bash
nvm install --lts
nvm use --lts
# Verify installation
node -v # Should show a v20.x.x version
npm -v
```

### 3. Clone & Install Dependencies
```bash
git clone [repository_url] disease-vision-app
cd disease-vision-app
npm install
```

### 4. Create Environment File

Copy the example and edit if necessary (see Config tab).
```bash
cp .env.example .env
```
_Note: For local dev, the default .env is often sufficient._

### 5. Run the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:9002.
</code></pre>
            </TabsContent>

            <TabsContent value="config" className="prose prose-sm max-w-none">
<pre className="bg-gray-100 p-4 rounded-md"><code>
The application uses a `.env` file for environment variables.

| NAME             | Required | Default | Description                                 |
|------------------|----------|---------|---------------------------------------------|
| `PORT`           | No       | `9002`  | Port for the Next.js application.           |
| `NEXTAUTH_URL`   | Yes      | -       | The canonical URL of your deployment.       |
| `NEXTAUTH_SECRET`| Yes      | -       | A random string for signing JWTs.           |
| `GEMINI_API_KEY` | Yes      | -       | Your Google AI Gemini API key for Genkit.   |

**Example `.env` file:**
```dotenv
# .env

# The port the app will run on. Defaults to 9002 if not set.
PORT=9002

# Required for NextAuth.js in production.
# Should be the public URL of your application.
NEXTAUTH_URL=http://localhost:9002

# A secret used to sign session cookies and JWTs.
# Generate one with: openssl rand -base64 32
NEXTAUTH_SECRET=your_super_secret_key_here

# Required for Genkit AI features.
GEMINI_API_KEY=your_gemini_api_key_here
```
</code></pre>
            </TabsContent>

            <TabsContent value="run" className="prose prose-sm max-w-none">
<pre className="bg-gray-100 p-4 rounded-md"><code>
For production, we recommend using a process manager like `systemd`.

### 1. Build the Application
```bash
npm run build
```

### 2. Create a systemd Service Unit

Create the file `/etc/systemd/system/disease-vision.service`:
```ini
[Unit]
Description=DiseaseVision Next.js Application
After=network.target

[Service]
User=your_username
Group=your_group
WorkingDirectory=/path/to/your/disease-vision-app
ExecStart=/path/to/your/.nvm/versions/node/v20.x.x/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=9002

[Install]
WantedBy=multi-user.target
```
*Replace `your_username`, `your_group`, `/path/to/your/disease-vision-app`, and the node version path.*

### 3. Manage the Service
```bash
# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable disease-vision.service

# Start the service immediately
sudo systemctl start disease-vision.service

# Check the status
sudo systemctl status disease-vision.service
```
</code></pre>
            </TabsContent>

            <TabsContent value="proxy" className="prose prose-sm max-w-none">
<pre className="bg-gray-100 p-4 rounded-md"><code>
Using Nginx as a reverse proxy is recommended for performance and security.

### 1. Install Nginx
```bash
sudo apt-get install -y nginx
```

### 2. Create Nginx Server Block

Create `/etc/nginx/sites-available/disease-vision`:
```nginx
server {
    listen 80;
    listen [::]:80;

    server_name your_domain.com; # Or your server's IP address

    location / {
        proxy_pass http://localhost:9002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable the Site
```bash
# Link the config to sites-enabled
sudo ln -s /etc/nginx/sites-available/disease-vision /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx to apply changes
sudo systemctl reload nginx
```
</code></pre>
            </TabsContent>

            <TabsContent value="firewall" className="prose prose-sm max-w-none">
<pre className="bg-gray-100 p-4 rounded-md"><code>
Configure the Uncomplicated Firewall (UFW) to secure your server.

```bash
# Allow OpenSSH
sudo ufw allow 'OpenSSH'

# Allow HTTP traffic
sudo ufw allow 'Nginx Full'

# Enable the firewall
sudo ufw enable
```

If you are **not** using a reverse proxy, allow the app's port directly:
```bash
sudo ufw allow 9002/tcp
```
</code></pre>
            </TabsContent>
            
            <TabsContent value="troubleshooting" className="prose prose-sm max-w-none">
<pre className="bg-gray-100 p-4 rounded-md"><code>
### Common Issues

**1. `npm install` fails**
- **Symptom:** Errors related to permissions or missing packages.
- **Fix:** Ensure you are using `nvm` and have installed Node LTS. Avoid using `sudo npm install`. If issues persist, try removing `node_modules` and `package-lock.json` and running `npm install` again.

**2. Port conflict on `npm run dev`**
- **Symptom:** `Error: listen EADDRINUSE: address already in use :::9002`
- **Fix:** Another service is using port 9002. Stop the other service or change the port in your `package.json`'s `dev` script (e.g., `next dev -p 9003`).

**3. Production build fails**
- **Symptom:** `npm run build` exits with an error.
- **Fix:** Check for TypeScript errors by running `npm run typecheck`. Ensure all dependencies are correctly installed.

**4. Service fails to start (`systemd`)**
- **Symptom:** `systemctl status disease-vision.service` shows a failed state.
- **Fix:** Check the logs with `journalctl -u disease-vision.service -n 50 --no-pager`. Common causes are incorrect paths in the service file or missing `.env` variables in the production environment.

**5. Nginx `502 Bad Gateway`**
- **Symptom:** The browser shows a 502 error when accessing the domain.
- **Fix:** This means Nginx can't reach the Next.js app.
  - Ensure the app is running: `sudo systemctl status disease-vision.service`.
  - Check that `proxy_pass` in the Nginx config points to the correct port (`http://localhost:9002`).
  - Check firewall rules.
</code></pre>
            </TabsContent>
            
            <TabsContent value="matrox" className="prose prose-sm max-w-none">
<pre className="bg-gray-100 p-4 rounded-md"><code>
### Matrox G200eW3 Server Deployment Guide

This guide details deploying the app on a server with a Matrox G200eW3 graphics controller.

**Key Hardware Note:** The Matrox G200eW3 is a server-class VGA controller for basic display output. It is **not** used for GPU acceleration or computation by this application. All chart and map rendering (including WebGL) happens in the **client's browser**, not on the server. The server can run entirely headless without a monitor.

---

### Step 1: OS & Node.js Installation

Follow the exact steps in the **"Setup (Local Server)"** tab to prepare your Debian/Ubuntu OS and install Node.js using `nvm`. No special graphics drivers are needed.

### Step 2: Clone Repository & Install Dependencies

```bash
git clone [repository_url] disease-vision-app
cd disease-vision-app
npm install
```

### Step 3: Configure Environment

Create your `.env` file for production.
```bash
# This will be used by the systemd service.
touch .env
```
Populate it with the necessary variables as described in the **"Config (.env)"** tab. `NEXTAUTH_URL` must be set to your public domain or IP address.

### Step 4: Build for Production
```bash
npm run build
```

### Step 5: Set Up systemd Service

Follow the guide in the **"Run & Service"** tab to create, enable, and start the `disease-vision.service` unit. Ensure all paths and user permissions are correct.

### Step 6: Set Up Nginx & Firewall

Follow the guides in the **"Reverse Proxy"** and **"Firewall"** tabs to configure Nginx and UFW. This will expose your application securely on port 80.

### Step 7: Verification Checklist

1.  **Check the service status:**
    ```bash
    sudo systemctl status disease-vision.service
    # Look for "active (running)"
    ```

2.  **Tail the logs for errors:**
    ```bash
    journalctl -u disease-vision.service -f
    ```

3.  **Check the health endpoint from the server:**
    ```bash
    curl http://localhost:9002/api/health
    # Should return: {"status":"ok", ...}
    ```

4.  **Access from a remote machine:**
    Open a modern browser (Chrome, Firefox, Edge) on a different computer on the same network and navigate to `http://[your-server-ip]`.

5.  **Confirm Functionality:**
    - The dashboard should load.
    - Charts and maps should render correctly. WebGL rendering is happening on *this* client machine, not on the server.
    - Filters and other interactive elements should work.

**Headless Operation:** The server does not require a monitor or desktop environment. All steps can be performed via SSH. The Matrox GPU's only role might be to show a TTY console if a monitor is connected.
</code></pre>
            </TabsContent>

          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
