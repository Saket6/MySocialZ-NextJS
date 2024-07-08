import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    // const {cookies} = request;
    // const token = sessionStorage.getItem('firebase:authUser:AIzaSyDNx_JtrJRERtWRO8KKtkmezBAUT-5yDe4:[DEFAULT]');
    // console.log(token);
    // if(cookies.get('authToken') === undefined)
    //     return NextResponse.redirect(new URL('/sign-in', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/about/:path*',
        '/',
        '/profile/:path*'
    ]
}