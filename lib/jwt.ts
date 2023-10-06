import jwt, { JwtPayload } from "jsonwebtoken";

interface signOption{
    expiresIn?: string | number;
}

const defaultSignOption:signOption = {
    expiresIn: '1d'
}

export function signJWTToken(payload: JwtPayload, options: signOption = defaultSignOption){
    const sk = process.env.SECRET_KEY;
    const token = jwt.sign(payload, sk!, options);
    return token;
}


export function verifyToken(token: string){
    try {
        const sk = process.env.SECRET_KEY!;
        const decoded = jwt.verify(token, sk);
        console.log('token ok')
        return decoded as JwtPayload;
    } catch (error) {
        console.log(error);
        return null;
    }
}