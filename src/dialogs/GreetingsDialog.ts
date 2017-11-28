import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "../controllers/MessagesController";
import MessageTypes from "../enums/MessageTypes";
import { Message } from "botbuilder";

class GreetingsDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];
                quickRepliesCard.text("You can find products using the buttons below or simply typing the name of the product.");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Brands 🍾");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Categories 🍸");
                if (session.message.source === "facebook") {
                    let facebookMessage = new builder.Message(session).text("Hello and welcome in the Pernod Ricard's catalog of products.");
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
                    session.send(facebookMessage);
                }
                else {
                    session.send("Hello and welcome in the Pernod Ricard's catalog of products.");
                    session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                }
                session.endDialog();
            }
        ]
    }
}

export default GreetingsDialog;
