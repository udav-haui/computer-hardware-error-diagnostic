@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Các triệu chứng</div>

                <div class="card-body">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Triệu chứng</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($symptoms as $symptom)
                                <tr>
                                    <td>
                                        <input class="chkbox" type="checkbox" name="" id="" data-value="{{ $symptom->symptom_code }}">
                                    </td>
                                    <td>
                                        <strong>{{ $symptom->symptom_code }} - </strong>{{ $symptom->description }}
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
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
