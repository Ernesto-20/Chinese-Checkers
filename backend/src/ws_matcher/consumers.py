import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from app.models import Player, Group, GroupStatus

MAX_PLAYERS = 2 # Only to test

class MatchManager(WebsocketConsumer):
    
    def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            self.close()
            return
        
        player, created = Player.objects.get_or_create(user=user)
        player.is_ready = True
        player.save()        
        
        group = Group.objects.filter(status=GroupStatus.WAITING).first()
        
        if group:
            players_count = group.players.count()
            
            if players_count + 1 == MAX_PLAYERS:
                # Close the group
                group.status = GroupStatus.PLAYING
        else:
            # There isn't any group waiting
            group = Group.objects.create(status=GroupStatus.WAITING)
            
        group.players.add(player)
        group.save()
        
        
        async_to_sync(self.channel_layer.group_add)(
            f"group_{group.id}",
            self.channel_name
        )
        
        self.accept()
        
        
        # Notify the players's group
        self.notify_players(group)

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        self.send(text_data=json.dumps({"message": message}))
    
    
    
    # Custom methods
    def notify_players(self, group):
        if group.status == GroupStatus.WAITING:
            async_to_sync(self.channel_layer.send)(
                self.channel_name,
                {
                    "type": "match.message",
                    "message": f"Waiting for more players in group {group.id}!",
                },
            )
        elif group.status == GroupStatus.PLAYING:
            # Start the game
            async_to_sync(self.channel_layer.group_send)(
                f"group_{group.id}",
                {
                    "type": "match.message",
                    "message": f"You have been matched!",
                },
            )
    def match_message(self, event):
        self.send(text_data=json.dumps({"message": event["message"]}))        
        