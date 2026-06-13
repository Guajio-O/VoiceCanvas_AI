const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const server = http.createServer((req, res) => {
    // API 代理
    if (req.url.startsWith('/api/')) {
        const apiPath = req.url.replace('/api/', '');
        console.log(`[${new Date().toLocaleString()}] Proxy request: ${apiPath}`);
        
        const options = {
            hostname: 'api-inference.huggingface.co',
            port: 443,
            path: '/' + apiPath,
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders(req)
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            console.log(`[${new Date().toLocaleString()}] Proxy response status: ${proxyRes.statusCode}`);
            
            res.writeHead(proxyRes.statusCode, {
                'Content-Type': proxyRes.headers['content-type'] || 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            
            proxyRes.on('data', (chunk) => {
                res.write(chunk);
            });
            
            proxyRes.on('end', () => {
                res.end();
            });
        });

        proxyReq.on('error', (e) => {
            console.error(`[${new Date().toLocaleString()}] Proxy error:`, e.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Proxy error: ' + e.message }));
        });

        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        
        req.on('end', () => {
            console.log(`[${new Date().toLocaleString()}] Request body:`, body.length > 100 ? body.substring(0, 100) + '...' : body);
            proxyReq.write(body);
            proxyReq.end();
        });
        
        return;
    }

    // 静态文件服务
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT'){
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function getHeaders(req) {
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
        if (key.toLowerCase() === 'authorization' || key.toLowerCase() === 'content-type') {
            headers[key] = value;
        }
    }
    return headers;
}

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`\n[${new Date().toLocaleString()}] Server running at http://localhost:${PORT}/`);
    console.log(`[${new Date().toLocaleString()}] API proxy available at http://localhost:${PORT}/api/models/...`);
    console.log('[INFO] Ready to receive requests...\n');
});

server.on('error', (e) => {
    console.error(`[${new Date().toLocaleString()}] Server error:`, e.message);
});