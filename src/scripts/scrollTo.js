export default function scrollTo(containerId, elementId) {
    $(`#${containerId}`).animate({
        scrollTop: $(`#${elementId}`).offset().top
    });
}
