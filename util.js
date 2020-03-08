const https = require('https');
exports.HttpsRequest = (url, options, data) => new Promise((resolve, reject) => {
    const request = https.request(url, options, response => {
        const ReturnResult = (result = null) => ((response.statusCode >= 200) && (response.statusCode < 300)) ? resolve(result) : reject({ code: response.statusCode, data: result });
        
        const chunks = [];
        let dataLen = 0;
        
        response.on('data', data => {
            chunks.push(data);
            dataLen += data.length;
        });
        
        response.on('end', () => {
            if(!response.complete)
                return reject();
            
            if(dataLen == 0)
                return ReturnResult();
            
            if(chunks.length == 1)
                return ReturnResult(chunks[0]);
            
            const data = Buffer.allocUnsafe(dataLen);
            let len = 0;
            for(let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                chunk.copy(data, len);
                len += chunk.length;
            }
            return ReturnResult(data);
        });
    });
    
    request.on('error', () => reject());
    
    if(data) {
        request.setHeader('Content-Length', Buffer.byteLength(data));
        request.setHeader('Content-Type', 'application/json');
    }
    
    request.end(data);
});
