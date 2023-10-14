////////////////////////////////////////////////////////////////////////////////////////////////
// パラメータ宣言

float opaque : CONTROLOBJECT < string name = "(self)"; string item = "Tr"; >;

shared texture ScreenShadowMap: OFFSCREENRENDERTARGET;
sampler ScreenShadowMapSampler = sampler_state {
    texture = <ScreenShadowMap>;
    MinFilter = LINEAR;
    MagFilter = LINEAR;
    MipFilter = LINEAR;
    AddressU  = CLAMP;
    AddressV = CLAMP;
};

float4x4 worldMatrix : World;
float4x4 projectionMatrix : PROJECTION;
float4x4 view_proj_matrix : ViewProjection;

float fSize = 1.25;

//ビューポートサイズ
float2 Viewport : VIEWPORTPIXELSIZE; 

///////////////////////////////////////////////////////////////////////////////////////////////

struct VS_OUTPUT
{
    float4 Pos        : POSITION;    // 射影変換座標
    float2 Tex        : TEXCOORD0;   // テクスチャ
};

// 頂点シェーダ
VS_OUTPUT Mask_VS(float4 Pos : POSITION, float2 Tex : TEXCOORD0)
{
/*
	//ワーク領域初期化
	float3 pos = 0;
	//画面のカタチを正規化
	float2 ViewportRatio = normalize(Viewport);
	//サイズ設定（PosにはXY平面とか入ってる）
	//スケール値はZ移動の量（worldMatrixの4行目）
	pos = Pos * (1 + worldMatrix[3].z * -0.1);
	//Siによる拡大（worldMatrix[1]でいつも取るけど0でもできるのカナ）
	pos *= length(worldMatrix[0]) * 0.1;
	//今は1:1なので、yを減らすか増やすかして画面のカタチに合わせる 
	pos.y *= Viewport.x / Viewport.y;
	//なんとなく小さくしたかった
	pos.xy *= 0.5;
	//スクリーン座標保存用ワーク領域
	//worldの4行目にはXYZ座標とWに1が入ってるので　小さくして入れる
	float4 tgt2D = worldMatrix[3] * 0.05;
	//座標加算
	pos += tgt2D.xyz;
	//Z値は邪魔なので消す
	pos.z = 0;
	//最終出力用変数に入れる
	Out.Pos = float4(pos, 1);
*/
	float Aspect = Viewport.x / Viewport.y;
	VS_OUTPUT Out;
	Out.Tex = Tex;

	float3 pos = 0;
	float2 ViewportRatio = normalize(Viewport);
	pos = Pos * (1 + worldMatrix[3].z * -0.1);
	pos *= length(worldMatrix[0]) * 0.1;
//	pos.y *= Viewport.x / Viewport.y;
	pos.xy *= 0.5;
	float4 tgt2D = worldMatrix[3] * 0.05;
	pos += tgt2D.xyz;
	pos.z = 0;
	Out.Pos = float4(pos, 1);

	return Out;
}

// ピクセルシェーダ
float4 Mask_PS( float2 Tex :TEXCOORD0 ) : COLOR0
{
	float4 Color = tex2D( ScreenShadowMapSampler, Tex );
    return float4(saturate(Color.rgb), opaque);
}

technique MainTec < string MMDPass = "object"; > {
    pass DrawObject {
        VertexShader = compile vs_2_0 Mask_VS();
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}
technique MainTec_Ss < string MMDPass = "object_ss"; > {
    pass DrawObject {
        VertexShader = compile vs_2_0 Mask_VS();
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}

// 輪郭は表示しない
technique EdgeTec < string MMDPass = "edge"; > { }
// 地面影は表示しない
technique ShadowTec < string MMDPass = "shadow"; > { }
// MMD標準のセルフシャドウは表示しない
technique ZplotTec < string MMDPass = "zplot"; > { }
