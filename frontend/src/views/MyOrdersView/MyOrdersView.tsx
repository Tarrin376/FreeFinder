import PageWrapper from "src/wrappers/PageWrapper";

function MyOrdersView() {
    return (
        <PageWrapper styles="pt-14">
            <h1 className="text-[30px] mb-6">
                My orders
            </h1>
            <p className="text-[15px] text-side-text-gray">
                In the my orders section, you can review and manage all orders with their details. You can view and edit the delivery status of 
                an order, get in touch with clients about potential delays, notify the client of the project's completion, and much more!
            </p>
        </PageWrapper>
    )
}

export default MyOrdersView;