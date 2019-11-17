var uncheck_alert = new Audio("sounds/what.mp3");
var clicked_alert = new Audio("sounds/tweet.mp3");
var danger_alert = new Audio("sounds/Cut_danger_alert.mp3");
var sound_alert = new Audio("sounds/system-fault.mp3");

$(document).ready(function() {
    // tạo mảng Giả Thiết
    var symptoms = [];
    
    // click vào tr để checkbox
    $(".record_table tr").click(function(event) {
        if (event.target.type !== "checkbox") {
            $(":checkbox", this).trigger("click");
        }
    });

    /*
    $("#analysisBtn").on("click", function() {
        // Duyệt checkbox lấy những mã GT
        // $.each($('.chkbox:checked'), function() {
        //     // đưa những GT đc chọn vào mảng GTs
        //     symptoms.push($(this).attr('data-value'));
        // });
        apiCallToAnalysis(symptoms);
    });
    */

    // Lắng nghe sự thay đổi của checkbox
    $(document).on("change", ".chkbox", function() {
        if ($(this).is(":checked")) {   // nếu bất kỳ checkbox nào đc chọn
            symptoms.push($(this).attr("data-value"));  // Đẩy mã triệU chứng vào tập mã triệU chứng (GT)
            apiCallToAnalysis(symptoms);    // Gọi hàm phân tích
            $(this).parent().parent().parent().toggleClass("selected");    // thêm/xoá class seleted
            clicked_alert.pause();  
            clicked_alert.currentTime = 0.0;
            clicked_alert.play();
        } else {
            // nếu bỏ check thì xoá mã triệu chứng thông qua hàm xoá 
            // phần tử khỏi array
            symptoms = arrayRemove(symptoms, $(this).attr("data-value"));
            $(this).parent().parent().parent().toggleClass("selected");    // thêm/xoá class seleted
            apiCallToAnalysis(symptoms);
            uncheck_alert.pause();
            uncheck_alert.currentTime = 0.0;
            uncheck_alert.play();
        }
    });

    // dừng âm thanh cảnh báo khi bấm vào bất kỳ đâu trên trang
    $(document).on("click", function() {
        danger_alert.pause();
    });
});
/**
 * Xoá một symptom code ra khỏi mảng symptoms
 * @param {mảng mã triệu chứng} arr
 * @param {1 mã triệu chứng muốn xoá} value
 */
function arrayRemove(arr, value) {
    return arr.filter(function(ele) {
        return ele != value;
    });
}

/**
 * hàm phân tích dữ liệu người dùng chọn
 * @param {mảng mã triệu chứng} symptoms 
 */
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
                var html = ``;
                if (response.data.length === 0) {
                    html += `<p class="diagnostic-content-info">
                            <i class="far fa-times-circle"></i><br />
                            Dữ liệu chưa đầy đủ, hệ thống không thể phân tích được cho bạn !!!</p>`;
                } else {
                    response.data.forEach(element => {
                        html += `<p class="item">`;
                        html += `<span>
                                <i class="fas fa-tools"></i>
                                </span>${element.description}`;
                        html += `</p>`;
                    });
                    if (response.data.length > 5) {
                        danger_alert.play();
                        danger_alert.loop = true;
                        Swal.fire({
                            title: "Lời khuyên?",
                            text: "Bạn nên mua máy mới! =))",
                            customClass: {
                                confirmButton: "btn btn-success",
                                cancelButton: "btn btn-danger"
                            },
                            buttonsStyling: false,
                            icon: "error",
                            confirmButtonText: "OK!"
                        }).then(result => {
                            if (result.value) {
                                danger_alert.pause();
                            }
                        });
                    }
                    sound_alert.play();
                }
                $(".diagnostic-content").html(html);
            }
        });
    }
}
