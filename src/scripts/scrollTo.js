export default function scrollTo(containerId, elementId) {
    const element = $(`#${elementId}`);
    if (element) {
        const offset = element.offset();
        if (offset) {
            $(`#${containerId}`).animate({
                scrollTop: offset.top,
            });
        }
    }
}
