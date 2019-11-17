$(document).ready(function () {
    $(document).ready(function() {
        $('.record_table tr').click(function(event) {
            if (event.target.type !== 'checkbox') {
                $(':checkbox', this).trigger('click');
            }
        });
    });

    $('#analysisBtn').on('click', function() {
        // tạo mảng Giả Thiết
        var symptoms = [];
        // Duyệt checkbox lấy những mã GT
        $.each($('.chkbox:checked'), function() {
            // đưa những GT đc chọn vào mảng GTs
            symptoms.push($(this).attr('data-value'));
        });
        console.log(symptoms);
        $.ajax({
            type: "post",
            url: "/analysis",
            data: {
                "_token": $('meta[name="csrf-token"]').attr('content'),
                "symptoms": symptoms,
            },
            dataType: "json",
            success: function (response) {
                console.log(response.data);
                var html = `<ul>`;
                response.data.forEach(element => {
                    html += `<li>${element.description}</li>`
                });
                html += `</ul>`;

                $('.diagnostic-content').html(html);
            }
        });
    });
});