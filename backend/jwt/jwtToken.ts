type JWTDecodedType = {
    header: {
        alg: 'HS256';  // e.g., 'HS256', 'RS256'
        typ: "JWT";   // Always "JWT"
    };
    payload: {
        name: string;      // User-specific data or any claim you want
        iat: number;       // Issued at: UNIX timestamp
        exp: number;       // Expiration time: UNIX timestamp
    };
    signature: string;    // The signature (Base64Url-encoded) generated from header and payload using secret key. JWT typically looks like xxxxx.yyyyy.zzzzz
}

const secretKey = 'my-very-secret-key';

// We will use HS256