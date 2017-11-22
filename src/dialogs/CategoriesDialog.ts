import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import CategoryController from "../controllers/CategoryController";
import MessagesController from "../controllers/MessagesController";

class CategoriesDialog extends BaseDialog {

    private static readonly _pageLength: number = 5;
    private static readonly _categoriesIntentName: string = "categories";
    private static readonly _loadCategoriesIntentName: string = "load.categories";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                if ((session.userData.categoryPage == null) || args.intent.intent === CategoriesDialog._categoriesIntentName) {
                    session.userData.categoryPage = 0;
                }
                else if (args.intent.intent === CategoriesDialog._loadCategoriesIntentName) {
                    session.userData.categoryPage++;
                }
                //Get categories
                CategoryController.getCategories(CategoriesDialog._pageLength, session.userData.categoryPage).then(categoryResponse => {
                    session.userData.categoryPage = categoryResponse.page;
                    let categoriesMessage = new builder.Message(session);
                    let categoriesMessageAttachments: builder.AttachmentType[] = [];
                    categoriesMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    categoryResponse.hits.forEach(category => {
                        let categoriesProductQuery = category.label.replace(/ /g, '+');
                        categoriesMessageAttachments.push(CategoryController.buildCategoryCard(category, session));
                    });
                    if (categoryResponse.nbPages > categoryResponse.page + 1) {
                        categoriesMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
                                .buttons([{
                                    type: "postBack",
                                    title: "Load more",
                                    text: "Load more",
                                    diplayText: "Load more",
                                    value: "Load more categories"
                                }])
                        );
                    }
                    else {
                        session.userData.categoryPage = 0;
                    }
                    categoriesMessage.attachments(categoriesMessageAttachments);
                    session.send(categoriesMessage);
                    session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                });
            }
        ]
    }
}

export default CategoriesDialog;