using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatSignalR.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _coonections;

        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "Chat Bot";
            _coonections = connections;
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            _coonections.Add(Context.ConnectionId, userConnection);
            await Clients.Groups(userConnection.Room)
                .SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined the room {userConnection.Room}");

            await SendConnectedUsers(userConnection.Room);
        }

        public async Task SendMessage(string message)
        {
            if (_coonections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.Groups(userConnection.Room)
                    .SendAsync("ReceiveMessage", userConnection.User, message);
            }
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _coonections.Values.Where(x => x.Room == room).Select(x => x.User);
            
            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_coonections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _coonections.Remove(Context.ConnectionId);
                Clients.Groups(userConnection.Room)
                    .SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left the room {userConnection.Room}");

                SendConnectedUsers(userConnection.Room);
            }

            return base.OnDisconnectedAsync(exception);
        }
    }
}
