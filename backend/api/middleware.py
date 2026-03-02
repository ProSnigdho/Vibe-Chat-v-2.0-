from django.shortcuts import redirect

class TrailingSlashMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api/') and not request.path.endswith('/'):
            return redirect(request.path + '/', permanent=True)
        return self.get_response(request)
