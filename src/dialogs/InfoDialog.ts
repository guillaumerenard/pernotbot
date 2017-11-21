import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";

class InfoDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                ProductController.getProductById(parameters.entity.product).then(product => {
                    if (parameters.entity.product !== undefined && parameters.entity.product !== null && parameters.entity.product.length > 0) {
                        session.userData.informations = ProductController.getInformations(product, session);
                    }
                    let productMessage = new builder.Message(session);
                    let productMessageAttachments: builder.AttachmentType[] = [];
                    productMessage.attachmentLayout(builder.AttachmentLayout.list);
                    let quickRepliesCard = new builder.HeroCard(session);
                    let quickRepliesButtons: builder.ICardAction[] = [];
                    if (session.userData.informations !== null && session.userData.informations.length > 0) {
                        for (let i in session.userData.informations) {
                            quickRepliesButtons.push({
                                type: "postBack",
                                title: session.userData.informations[i],
                                value: session.userData.informations[i]
                            });
                        }
                    }
                    quickRepliesButtons.push({
                        type: "postBack",
                        title: "Back to filters 🔙",
                        value: "Back to filters 🔙"
                    });
                    quickRepliesCard.buttons(quickRepliesButtons);
                    productMessageAttachments.push(quickRepliesCard);
                    productMessage.attachments(productMessageAttachments);
                    productMessage.text("Want to know more about");
                    session.send(productMessage);
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                });
            }
        ]
    }
}

export default InfoDialog;