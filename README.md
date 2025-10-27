# Straylight Café

A cyberpunk-themed community hub for cyberspace enthusiasts, featuring ONOSENDAI - the cyberspace client for the one true metaverse.

## Features

- **ONOSENDAI Integration**: Direct links to the in-browser cyberspace client
- **Live Chat Messages**: Real-time display of messages from the cyberspace Nostr relay
- **Community Links**: Quick access to GitHub, documentation, and community chat
- **Bitcoin Lightning Donations**: Support development through Lightning payments
- **Cyberpunk Aesthetic**: Inspired by William Gibson's Neuromancer

## Technology Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- nostr-tools for Nostr relay integration
- Static export for easy deployment

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Visit http://localhost:3000

### Build for Production
```bash
npm run build
```

## Deployment

This site is configured for static export, making it easy to deploy via SFTP.

### Build for Deployment
```bash
npm run build
```

### Deploy via SFTP

After building, the static files will be in the `out` directory. Upload the entire contents of the `out` directory to your web server:

```bash
# Example using sftp
sftp user@straylight.cafe
> put -r out/* /path/to/public_html/
```

Or using any SFTP client:
1. Connect to your server
2. Navigate to your web root directory
3. Upload all files from the `out` folder

### Alternative Deployment Methods

The static export can be deployed to any static hosting service:
- Nginx/Apache web server
- Cloudflare Pages
- GitHub Pages
- Netlify (drag & drop the `out` folder)
- Any static file host

## Configuration

### Environment Variables
No environment variables required for basic operation.

### Customization

- **Colors**: Edit CSS variables in `app/globals.css`
- **Content**: Modify sections in `app/page.tsx`
- **Chat Relay**: Update relay URL in `components/ChatMessages.tsx`

## Links

- **ONOSENDAI**: https://onosendai.tech
- **GitHub**: https://github.com/arkin0x/ONOSENDAI
- **Documentation**: https://cyberspace.international
- **Community Chat**: https://app.flotilla.social/join?r=cyberspace.nostr1.com

## License

MIT License - See LICENSE file for details

## Credits

Inspired by William Gibson's Neuromancer and the concept of cyberspace.
