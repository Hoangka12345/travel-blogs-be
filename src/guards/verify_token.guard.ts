import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization

        if (authHeader && authHeader.split(" ")[0] === "Bearer") {
            const token = authHeader.split(" ")[1]
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY) as jwt.JwtPayload
                request['user'] = decoded
                return true
            } catch (error) {
                throw new UnauthorizedException('Invalid or expired token')
            }
        } else {
            throw new UnauthorizedException('Authorization header is missing or invalid');
        }
    }
}