@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Các triệu chứng</div>

                <div class="card-body">
                    <div class="table-responsive">
                    <table class="table table-fixed record_table">
                        <thead>
                            <tr>
                                <th scope="col" class="col-1">#</th>
                                <th scope="col" class="col-11">Triệu chứng</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($symptoms as $symptom)
                                <tr>
                                    <th scope="row" class="col-1">
                                        <input class="chkbox" type="checkbox" name="check-{{ $symptom->symptom_code }}" id="" data-value="{{ $symptom->symptom_code }}">
                                    </th>
                                    <td class="col-11">{{ $symptom->description }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                    <a href="javascript:void(0);" id="analysisBtn">Phân tích</a>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Chẩn đoán</div>

                <div class="card-body">
                    <div class="diagnostic-content">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
