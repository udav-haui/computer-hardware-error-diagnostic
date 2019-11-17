<?php

namespace App\Http\Controllers;

use App\Conclude;
use App\Luat;
use App\Rule;
use App\Symptom;
use Illuminate\Http\Request;

class DiagnosticController extends Controller
{
    /**
     * show diagnostic dashboard
     */
    public function index()
    {
        $symptoms =  Symptom::all();
        return view('diagnostic', compact('symptoms'));
    }

    /**
     * analysis user problems
     */
    public function analysis()
    {
        // lấy mã triệu chứng
        $symptoms = request("symptoms");
        // lấy tập kết luận
        $concludes = Conclude::all()->toArray();
        // định dạng về tập luật chuẩn.
        $rules = $this->GetRules(Rule::all()->toArray());
        // Tạo tập trung gian
        $temp_symptoms = $symptoms;
        // Tạo tập SAT bằng lọc những luật khả dụng
        $SAT = $this->rules_filter($rules, $temp_symptoms);
        /**
         * Trong khi tập SAT vẫn còn luật chưa dùng đến
         */
        while($this->CheckSAT($SAT)) {
            /**
             * Ta tiến hành lấy 1 luật trong tập SAT sau đó đẩy vế phải 
             * của luật đó vào cuối mảng tập trung gian
             */
            $this->PushToRight($this->TakeARuleFromSAT($SAT), $temp_symptoms);
            // tìm những luật mới khả dụng khi tậP trung gian đưỢc thêm mới các phần tử
            $temp = $this->rules_filter($rules, $temp_symptoms);
            // gộp mảng luật mới tìm đc vào mảng tập SAT cũ
            $SAT = array_merge($SAT, $temp);
        };

        $result = [];
        /**
         * Duyệt lần lượt các phần tử của mảng kết luận
         * Nếu phần tử có conclude_code tồn tại trong mảng $temp_symptoms
         * thì đưa vào mảng kết quả !!
         */
        foreach($concludes as $conclude) {
            if (in_array($conclude['conclude_code'], $temp_symptoms)) {
                array_push($result, $conclude);
            }
        }
        /**
         * trả kết quả dưới dạng json
         */
        return response()->json([
            'status_code' => 200,
            'data' => $result
        ]);
    }

    /**
     * Đẩy vế phải của luật lấy trong tập SAT vào tập Temp_symptoms
     */
    public function PushToRight($rule, &$temp_symptoms)
    {
        foreach($rule->right as $right) {
            if (!in_array($right, $temp_symptoms)) {
                array_push($temp_symptoms, $right);
            }
        }
    }

    /**
     * lấy 1 luật từ trong tậP SAT ra
     */
    public function TakeARuleFromSAT($SAT)
    {
        $i = 0;
        while($i < count($SAT)) {
            if (!$SAT[$i]->isUsed) {
                $SAT[$i]->isUsed = true;
            break;
            }
            $i++;
        }
        return ($SAT[$i]);
    }

    /**
     * Kiểm tra tập SAT có rỗng hay không
     * @param SAT array
     * @return true/false
     */
    public function CheckSAT($SAT)
    {
        // Nếu tập SAT bằng rõng thì trả về false
        if (count($SAT) == 0)    return false;
        // duyệt các luật trong tập SAT
        foreach($SAT as $item) {
            // Nếu vẫn còn luật chưa được sử dụng thì trả về true
            if (!$item->isUsed) return true;
        }
        return false;
    }

    /**
     * Lọc các luật khả dụng
     * @param rules, temp_symptoms
     * @return array
     */
    public function rules_filter($rules, $temp_symptoms)
    {
        // Biến cờ kiểm tra nếu các biến trogn tập đang xét với các biến của vế trái luật
        $isExit = true;
        // khởi tạo mảg lưu trữ các luật khả dụng
        $filteredRules = [];
        foreach($rules as $rule) {  // duyệt lần lượt các luật trogng tập luật
            if (!$rule->isUsed) {   // kiểm tra xem luật đã được sử dụng hay chưa
                foreach($rule->left as $value) {    // duyệt các vế trái của luật
                    /**
                     * Kiểm tra xem các điều kiện bên vế trái có trong tập giả
                     * thiết hay không, nếu có 1 điều kiệN không có trong tậP giả
                     * thiết thì đặt biết cờ bằng false
                     */
                    if (!in_array($value, $temp_symptoms)) {
                        $isExit = false;
                    }
                }
                /**
                 * nếu tất cả các biến của vế trái luật đều có trong tập GT thì thêm
                 * luật đó vào tập luật khả dụng.
                 */
                if ($isExit) {
                    array_push($filteredRules, $rule);
                }
                $isExit = true; // gán lại giá trị true cho biến cờ
            }
        }
        return $filteredRules;
    }

    /**
     * Định dạng tập luật
     * @param collection
     * @return array
     */
    public function GetRules($rule_records)
    {
        $rules = [];
        foreach ($rule_records as $rule) {   // duyệt mảng các bản ghi luật trong db
            // format luật theo chuẩn rồi đẩy vào mảng luật
            array_push($rules, $this->FormatARule($rule));
        }
        return $rules;
    }

    /**
     * định dạng lại luật
     * @param collection item
     * @return App\Luat
     */
    public function FormatARule($rule_record)
    {
        // khởi tạo biến luật
        $luat = new Luat();
        // Lấy ra vế trái vế phải
        $rule_array = preg_split("/ -> /",$rule_record['rule']);
        // gán các giá trị vào cho biến luật
        $luat->rule_code = $rule_record['rule_code'];   // chỉ số luật
        $luat->isUsed = false;  // Luật này chưa được sử dụng
        $luat->right[] = $rule_array[1];  // Vế phải
        $luat->left = preg_split("/ \^ /", $rule_array[0]); // mảng các gt vế trái
        return $luat;
    }
}
