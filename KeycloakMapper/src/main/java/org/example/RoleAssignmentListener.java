package org.example;

import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.RoleModel;
import org.keycloak.models.UserModel;

public class RoleAssignmentListener implements EventListenerProvider {
    private final KeycloakSession session;

    public RoleAssignmentListener(KeycloakSession session){
        this.session = session;
    }

    @Override
    public void onEvent(Event event) {
        if (event.getType() == EventType.REGISTER) {
            String userId = event.getUserId();
            RealmModel realm = session.getContext().getRealm();
            UserModel user = session.users().getUserById(realm, userId);

            String preferredRole = user.getFirstAttribute("memberOf");
            if(preferredRole != null && (preferredRole.equals("guest") || preferredRole.equals("host"))){
                RoleModel role = realm.getRole(preferredRole);
                if(role != null) {
                    user.grantRole(role);
                }
            }
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {

    }

    @Override
    public void close() {
    }
}