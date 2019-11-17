$(document).ready(function() {
    // tạo mảng Giả Thiết
    var symptoms = [];
    $(".record_table tr").click(function(event) {
        if (event.target.type !== "checkbox") {
            $(":checkbox", this).trigger("click");
            $(this).toggleClass("selected");
        }
    });

    $("#analysisBtn").on("click", function() {
        // Duyệt checkbox lấy những mã GT
        // $.each($('.chkbox:checked'), function() {
        //     // đưa những GT đc chọn vào mảng GTs
        //     symptoms.push($(this).attr('data-value'));
        // });
        apiCallToAnalysis(symptoms);
    });

    $(document).on("change", ".chkbox", function() {
        if ($(this).is(":checked")) {
            symptoms.push($(this).attr("data-value"));
            apiCallToAnalysis(symptoms);
        } else {
            var temp = symptoms;
            symptoms = arrayRemove(symptoms, $(this).attr("data-value"));
            apiCallToAnalysis(symptoms);
        }
    });
});
/**
 * Xoá một symptom code ra khỏi mảng symptoms
 * @param {symptoms} arr
 * @param {tymptom} value
 */
function arrayRemove(arr, value) {
    return arr.filter(function(ele) {
        return ele != value;
    });
}

function apiCallToAnalysis(symptoms) {
    if (symptoms.length > 0) {
        $.ajax({
            type: "post",
            url: "/analysis",
            data: {
                _token: $('meta[name="csrf-token"]').attr("content"),
                symptoms: symptoms
            },
            dataType: "json",
            success: function(response) {
                var sound_alert = new Audio("sounds/what.mp3");
                var html = ``;
                if (response.data.length === 0) {
                    html += `<p class="diagnostic-content-info">Dữ liệu chưa đầy đủ, hệ thống không thể phân tích được cho bạn !!!</p>`;
                } else {
                    response.data.forEach(element => {
                        html += `<p class="item">`;
                        html += `<span>
                                <i class="fas fa-tools"></i>
                                </span>${element.description}`;
                        html += `</p>`;
                    });
                    sound_alert.play();
                }
                $(".diagnostic-content").html(html);
            }
        });
    }
}
