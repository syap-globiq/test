/**
 * @return {Boolean}
 * @properties={type:-4,typeid:36,uuid:"F4A3FEC5-3337-4ADD-AD0A-B92C5863A2F1"}
 */
function is_active()
{
	// SESSION IS CLOSED
	if(session_end) return false;
	
	// SESSION IS NOT CLOSED, CHECK ACTIVE CLIENTS
	var clients = plugins.clientmanager.getConnectedClients();
	for(var i in clients){
		if(servoy_client_id == clients[i].getClientID()) return true;
	}
	return false;
}
