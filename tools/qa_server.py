"""Local QA server that applies this repository's production security headers."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        content = Path('_headers').read_text(encoding='utf-8').split('/*.html')[0]
        for line in content.splitlines():
            if line.startswith('  ') and ': ' in line:
                name, value = line.strip().split(': ', 1)
                if name != 'Strict-Transport-Security':
                    self.send_header(name, value)
        super().end_headers()
ThreadingHTTPServer.request_queue_size = 128
if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 8767), Handler).serve_forever()
