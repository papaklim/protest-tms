package io.protest.webutils.event;

import java.util.UUID;

public record TestcaseEvent(
    UUID id,
    UUID projectId,
    String title,
    String actionType // "CREATE", "UPDATE", "DELETE"
) {

}
