var uncheck_alert = new Audio("sounds/what.mp3");
var clicked_alert = new Audio("sounds/tweet.mp3");
var danger_alert = new Audio("sounds/Cut_danger_alert.mp3");
var sound_alert = new Audio("sounds/system-fault.mp3");
var error_count = 0;
// tạo mảng Giả Thiết
var symptoms = [];

$(document).ready(function() {
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
            // DOM
            $(this).parent().parent().parent().toggleClass("selected");    // thêm/xoá class seleted
            $('.delete-all-btn a strong').text(`( ${symptoms.length} )`);
            // END DOM
            playSound(clicked_alert);
        } else {
            // nếu bỏ check thì xoá mã triệu chứng thông qua hàm xoá 
            // phần tử khỏi array
            symptoms = arrayRemove(symptoms, $(this).attr("data-value"));
            // DOM
            $(this).parent().parent().parent().toggleClass("selected");    // thêm/xoá class seleted
            $('.delete-all-btn a strong').text(`( ${symptoms.length} )`);
            // END DOM
            apiCallToAnalysis(symptoms);
            playSound(uncheck_alert);
        }
    });

    // dừng âm thanh cảnh báo khi bấm vào bất kỳ đâu trên trang
    $(document).on("click", function() {
        danger_alert.pause();
    });

    // Xoá tất cả checkbox
    $(document).on('click', '.delete-all-btn a', function() {
        playSound(uncheck_alert);
        symptoms = [];
        $.each($('.chkbox:checked'), function () {
            $(this).prop('checked', false);
            $('.delete-all-btn a strong').text(`( ${symptoms.length} )`);
            $(this).parent().parent().parent().toggleClass("selected");    // thêm/xoá class seleted
            $(".diagnostic-content").html(`<p class="diagnostic-content-info">
                <i class="fas fa-info-circle"></i><br />
                Vui lòng chọn các tình trạng máy tính của bạn !!!
            </p>`);
        });
        $(".explain-content").slideUp(550).html('');
        $('.explain-container').fadeOut(100);
        var explainBtn = $('.explain-btn');
        explainBtn.children().css({
            "transform": "rotate(0deg)"
        });
        explainBtn.children().removeClass('rotated');
    });

    // Hiển thị diễn giải
    $(document).on ('click', '.explain-btn', function() {
        if ($(this).children().hasClass('rotated')) {
            $(this).children().css({
                "transform": "rotate(0deg)"
            });
            $(this).children().removeClass('rotated');
        } else {
            $(this).children().css({
                "transform": "rotate(180deg)"
            });
            $(this).children().addClass('rotated');
        }
        $('.explain-content').slideToggle(550);
    });
});

/**
 * chạy âm thanh truyền vào
 * @param {chạy âm thanh} sound 
 */
function playSound(sound)
{
    sound.pause();
    sound.currentTime = 0.0;
    sound.play();
}

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
                            <i class="far fa-times-circle fa-tada"></i><br />
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
                    if (response.data.length !== error_count) {sound_alert.play();}
                    error_count = response.data.length;
                }
                $(".diagnostic-content").html(html);
                $(".explain-content").html(response.html);
                $('.explain-container').fadeIn(100);
            }
        });
    } else {
        $(".diagnostic-content").html(`<p class="diagnostic-content-info">
                <i class="fas fa-info-circle"></i><br />
                Vui lòng chọn các tình trạng máy tính của bạn !!!
        </p>`);
        $(".explain-content").html(``);
        $('.explain-container').fadeOut(100);
    }
}
