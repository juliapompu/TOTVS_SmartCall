package com.totvs.smartcall.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

/**
 * SERVIÇO DE IA
 *
 * Responsável por se comunicar com as APIs de IA (OpenAI ou Gemini)
 * para processar as transcrições das chamadas.
 *
 * O provider (openai ou gemini) é definido no application.properties
 * em: ai.provider=openai
 *
 * FLUXO:
 * 1. Recebe o texto bruto da transcrição
 * 2. Monta o prompt pedindo análise estruturada
 * 3. Envia para a IA escolhida
 * 4. Retorna o resultado estruturado para salvar no banco
 */
@Service
public class IaService {

    // Qual IA usar: "openai" ou "gemini"
    @Value("${ai.provider}")
    private String provider;

    // Configurações OpenAI
    @Value("${ai.openai.api-key}")
    private String openAiKey;

    @Value("${ai.openai.model}")
    private String openAiModel;

    @Value("${ai.openai.base-url}")
    private String openAiBaseUrl;

    // Configurações Gemini
    @Value("${ai.gemini.api-key}")
    private String geminiKey;

    @Value("${ai.gemini.model}")
    private String geminiModel;

    @Value("${ai.gemini.base-url}")
    private String geminiBaseUrl;

    /**
     * Processa uma transcrição e retorna análise estruturada da IA.
     * Decide automaticamente qual IA usar com base no application.properties.
     *
     * @param textoTranscricao Texto bruto da transcrição
     * @return Map com: resumo, pontosChave, sentimento, produtosCitados, proximasAcoes
     */
    public Map<String, String> processarTranscricao(String textoTranscricao) {
        // Monta o prompt que será enviado para a IA
        String prompt = montarPrompt(textoTranscricao);

        // Decide qual IA chamar
        String respostaIa;
        if ("gemini".equalsIgnoreCase(provider)) {
            respostaIa = chamarGemini(prompt);
        } else {
            respostaIa = chamarOpenAI(prompt);
        }

        // Converte a resposta em texto estruturado
        return parsearRespostaIa(respostaIa);
    }

    /**
     * Monta o prompt estruturado que será enviado para a IA.
     * O formato de resposta é definido aqui para facilitar o parse.
     */
    private String montarPrompt(String transcricao) {
        return """
            Você é um assistente especializado em análise de chamadas comerciais da TOTVS.
            Analise a transcrição abaixo e responda EXATAMENTE neste formato (sem markdown, sem explicações extras):

            RESUMO: [resumo objetivo em 2-3 frases do que foi discutido]
            PONTOS_CHAVE: [ponto1; ponto2; ponto3]
            SENTIMENTO: [POSITIVO ou NEUTRO ou NEGATIVO]
            PRODUTOS_CITADOS: [produto1, produto2]
            PROXIMAS_ACOES: [ação de follow-up recomendada]

            TRANSCRIÇÃO:
            """ + transcricao;
    }

    /**
     * Chama a API da OpenAI (ChatGPT)
     * Endpoint: POST https://api.openai.com/v1/chat/completions
     */
    private String chamarOpenAI(String prompt) {
        WebClient client = WebClient.builder()
                .baseUrl(openAiBaseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        // Monta o corpo da requisição no formato da OpenAI
        Map<String, Object> body = Map.of(
                "model", openAiModel,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 500,
                "temperature", 0.3  // Baixo = respostas mais objetivas e consistentes
        );

        try {
            // Faz a requisição e extrai o texto da resposta
            Map resposta = client.post()
                    .uri("/chat/completions")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Navega pelo JSON: choices[0].message.content
            List choices = (List) resposta.get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            return (String) message.get("content");

        } catch (Exception e) {
            System.err.println("Erro ao chamar OpenAI: " + e.getMessage());
            return gerarRespostaPadrao();
        }
    }

    /**
     * Chama a API do Google Gemini
     * Endpoint: POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
     */
    private String chamarGemini(String prompt) {
        WebClient client = WebClient.builder()
                .baseUrl(geminiBaseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        // Monta o corpo da requisição no formato do Gemini
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            // A chave vai como query param na URL do Gemini
            Map resposta = client.post()
                    .uri("/models/" + geminiModel + ":generateContent?key=" + geminiKey)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Navega pelo JSON: candidates[0].content.parts[0].text
            List candidates = (List) resposta.get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");
            List parts = (List) content.get("parts");
            Map part = (Map) parts.get(0);
            return (String) part.get("text");

        } catch (Exception e) {
            System.err.println("Erro ao chamar Gemini: " + e.getMessage());
            return gerarRespostaPadrao();
        }
    }

    /**
     * Faz o parse da resposta da IA no formato definido no prompt.
     * Extrai cada campo e monta um Map para salvar no banco.
     */
    private Map<String, String> parsearRespostaIa(String resposta) {
        // Valores padrão caso o parse falhe
        String resumo = "Não foi possível gerar resumo.";
        String pontosChave = "Não identificado.";
        String sentimento = "NEUTRO";
        String produtosCitados = "Não identificado.";
        String proximasAcoes = "Realizar follow-up.";

        // Extrai cada linha da resposta da IA
        for (String linha : resposta.split("\n")) {
            if (linha.startsWith("RESUMO:")) {
                resumo = linha.replace("RESUMO:", "").trim();
            } else if (linha.startsWith("PONTOS_CHAVE:")) {
                pontosChave = linha.replace("PONTOS_CHAVE:", "").trim();
            } else if (linha.startsWith("SENTIMENTO:")) {
                sentimento = linha.replace("SENTIMENTO:", "").trim();
                // Garante que o valor é válido para o banco
                if (!List.of("POSITIVO", "NEUTRO", "NEGATIVO").contains(sentimento)) {
                    sentimento = "NEUTRO";
                }
            } else if (linha.startsWith("PRODUTOS_CITADOS:")) {
                produtosCitados = linha.replace("PRODUTOS_CITADOS:", "").trim();
            } else if (linha.startsWith("PROXIMAS_ACOES:")) {
                proximasAcoes = linha.replace("PROXIMAS_ACOES:", "").trim();
            }
        }

        return Map.of(
                "resumo", resumo,
                "pontosChave", pontosChave,
                "sentimento", sentimento,
                "produtosCitados", produtosCitados,
                "proximasAcoes", proximasAcoes
        );
    }

    /**
     * Resposta padrão usada quando a IA não está disponível.
     * Evita que o sistema quebre se a chave for inválida.
     */
    private String gerarRespostaPadrao() {
        return """
            RESUMO: Transcrição recebida mas IA não disponível no momento.
            PONTOS_CHAVE: Verificar configuração da IA
            SENTIMENTO: NEUTRO
            PRODUTOS_CITADOS: Não identificado
            PROXIMAS_ACOES: Verificar configuração da chave de IA no application.properties
            """;
    }
}
