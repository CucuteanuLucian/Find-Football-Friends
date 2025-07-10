import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def sync_teams(request):
    #token = "95POticCuXrZTbz4bQhLUilSifee2MUeTvpduRFTKNmaQqLvkwdyR2SSpjIt"
    import csv
    with open("teams/Team.csv", encoding="utf-8") as file:
        reader = csv.reader(file)
        next(reader)

        for row in reader:
            Team.objects.update_or_create(
                id=int(row[0]),
                defaults={"name": row[1], "logo": ""}
            )
    return Response()

@api_view(['POST'])
@permission_classes([AllowAny])
def create_team(request):
    data = request.data
    try:
        team = Team.objects.create(
            name=data['name'],
            logo=data['logo']
        )
        return Response({"id": team.id, "name": team.name, "logo": team.logo}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
@permission_classes([AllowAny])
def search_teams(request):
    query = request.GET.get("search", "")
    teams = Team.objects.filter(name__icontains=query) if query else Team.objects.all()
    serializer = TeamSerializer(teams, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_team_photo_by_name(request, team_name):
    try:
        team = Team.objects.get(name=team_name)
        return Response({"logo": team.logo}, status=200)
    except Team.DoesNotExist:
        return Response({"error": "Team not found"}, status=404)