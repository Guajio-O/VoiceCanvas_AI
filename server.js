const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const server = http.createServer((req, res) => {
    if (req.url === '/api/test' && req.method === 'GET') {
        const responseBody = JSON.stringify({ translated: 'Draw a cute cat' });
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Content-Length': Buffer.byteLength(responseBody, 'utf8')
        });
        res.end(responseBody, 'utf8');
        return;
    }
    
    if (req.url === '/api/translate' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log(`[DEBUG] Translating: ${data.text}`);
                translateText(data.text)
                    .then(translated => {
                        console.log(`[DEBUG] Translated result: ${translated}`);
                        const responseBody = JSON.stringify({ translated });
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Access-Control-Allow-Origin': '*',
                            'Content-Length': Buffer.byteLength(responseBody, 'utf8')
                        });
                        res.end(responseBody, 'utf8');
                    })
                    .catch(error => {
                        console.error('[ERROR] Translation failed:', error.message);
                        res.writeHead(500, {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ translated: data.text }));
                    });
            } catch (error) {
                res.writeHead(400, {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }

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
        filePath = './voicecanvas-ai.html';
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

const SIMPLE_TRANSLATIONS = {
    '画一只可爱的猫': 'Draw a cute cat',
    '画一个圆': 'Draw a circle',
    '画一个太阳': 'Draw a sun',
    '画一个月亮': 'Draw a moon',
    '画一只鸟': 'Draw a bird',
    '画一只狗': 'Draw a dog',
    '可爱的猫在晒太阳': 'A cute cat is sunbathing',
};

async function translateText(text) {
    if (SIMPLE_TRANSLATIONS[text]) {
        console.log(`[DEBUG] Using simple translation: ${text} -> ${SIMPLE_TRANSLATIONS[text]}`);
        return SIMPLE_TRANSLATIONS[text];
    }
    
    const translateUrl = 'https://translate.googleapis.com/translate_a/single';
    
    const params = new URLSearchParams({
        client: 'gtx',
        sl: 'zh',
        tl: 'en',
        dt: 't',
        q: encodeURIComponent(text)
    });

    console.log(`[DEBUG] Translate URL: ${translateUrl}?${params.toString()}`);

    return new Promise((resolve, reject) => {
        https.get(`${translateUrl}?${params.toString()}`, (res) => {
            console.log(`[DEBUG] Response status: ${res.statusCode}`);
            
            res.setEncoding('utf8');
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`[DEBUG] Raw response data:`, data);
                
                try {
                    const result = JSON.parse(data);
                    if (result[0] && result[0][0] && result[0][0][0]) {
                        const translatedText = result[0][0][0];
                        console.log(`[DEBUG] Extracted translation: ${translatedText}`);
                        resolve(translatedText);
                    } else {
                        console.error('[ERROR] Translation result format error:', data);
                        resolve(text);
                    }
                } catch (e) {
                    console.error('[ERROR] JSON parse error:', e.message);
                    resolve(text);
                }
            });
        }).on('error', (e) => {
            console.error('[ERROR] Google Translate API error:', e.message);
            resolve(text);
        });
    });
}

server.on('error', (e) => {
    console.error(`[${new Date().toLocaleString()}] Server error:`, e.message);
});