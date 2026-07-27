from django.http import JsonResponse

def health(request):
    return JsonResponse({
        "status": "OK",
        "application": "NTPC E&M Inspection System",
        "version": "1.0"
    })