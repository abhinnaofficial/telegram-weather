import { Controller, Get, Query, Req, Res, UseGuards, Session } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    async googleLogin(@Req() req, @Res() res, @Session() session) {
        // Check if user is already logged in
        if (req.session.user) {
            // User is already logged in, redirect them directly to the dashboard
            res.redirect('http://localhost:3001/dashboard');
        } else {
            // Guard redirects to Google
            // This is handled automatically by Passport's Google strategy, so no code needed here
        }
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res() res, @Session() session) {
        session.user = req.user; // Store user in session
        res.redirect('http://localhost:3001/dashboard');
    }

    @Get('session')
    async checkSession(@Req() req, @Res() res) {
        if (req.session.user) {
            res.status(200).json({ user: req.session.user, isAuthenticated: true });
        } else {
            res.status(200).json({ isAuthenticated: false });
        }
    }

    @Get('logout')
    async logout(@Req() req, @Res() res, @Session() session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction failed:', err);
                res.status(500).json({ message: 'Failed to log out' });
            } else {
                res.redirect('http://localhost:3001/');
            }
        });
    }
}
