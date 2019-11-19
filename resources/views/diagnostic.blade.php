@extends('layouts.app')

@section('title')Tìm lỗi phần cứng
@endsection

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-7">
            <div class="card">
                <div class="card-header">Các triệu chứng</div>
                <div class="card-body">
                    <div class="delete-all-btn">
                        <a href="javascript:void(0);">Xoá <strong>( 0 )</strong> đã chọn</a>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-fixed record_table">
                            <tbody>
                                @foreach($symptoms as $symptom)
                                <tr class="">
                                    <th scope="row" class="col-1">
                                        <div class="pretty p-default p-curve p-thick">
                                            <input type="checkbox" class="chkbox" data-value="{{ $symptom->symptom_code }}" />
                                            <div class="state p-success-o">
                                                <label></label>
                                            </div>
                                        </div>
                                    </th>
                                    <td class="col-11">{{ $symptom->description }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-5 diagnostic-box">
            <div class="card">
                <div class="card-header"><i class="fas fa-stethoscope"></i> Chẩn đoán</div>

                <div class="card-body">
                    <div class="diagnostic-content">
                        <p class="diagnostic-content-info">
                            <i class="fas fa-info-circle"></i><br />
                            Vui lòng chọn các tình trạng máy tính của bạn !!!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-4 explain-container" style="display: none;">
            <a href="javascript:void(0);" class="explain-btn">Diễn giải&nbsp;<i class="fas fa-angle-down"></i></a>
        </div>
    </div>

    <div class="row justify-content-center">
        <div class="col-md-12 explain-container">
            <div class="explain-content">
            </div>
        </div>
    </div>
</div>
@endsection