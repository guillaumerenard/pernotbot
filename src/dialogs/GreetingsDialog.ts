import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "../controllers/MessagesController";
import ChatBase from "../controllers/ChatbaseController";

class GreetingsDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                const quickRepliesButtons: builder.ICardAction[] = [];
                quickRepliesCard.text("You can find products using the buttons below or simply typing the name of the product.");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Brands 🍾");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Categories 🍸");
                // Defines message type depending on the chatting platform
                switch (session.message.source) {
                    case "facebook":
                        const facebookMessage = new builder.Message(session).text("Hello and welcome in the Pernod Ricard's catalog of products.");
                        session.send(facebookMessage);
                        facebookMessage.text("You can find products using the buttons below or simply typing the name of the product.");
                        facebookMessage.sourceEvent({
                            facebook: {
                                quick_replies: [
                                    {
                                        content_type: "text",
                                        title: "Brands 🍾",
                                        payload: "Brands"
                                    },
                                    {
                                        content_type: "text",
                                        title: "Categories 🍸",
                                        payload: "Categories"
                                    }
                                ]
                            }
                        });
                        ChatBase.sendHandled(session, "facebook", session.message.text, args.intent.intent);
                        session.send(facebookMessage);
                        break;
                    default:
                        ChatBase.sendHandled(session, "webchat", session.message.text, args.intent.intent);
                        session.send("Hello and welcome in the Pernod Ricard's catalog of products.");
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default GreetingsDialog;
