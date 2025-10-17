namespace Edict.Application;

public static class PromptBuilder
{
    public static string BuildJudgePrompt(string query, string context) => 
        Prompts.JudgePrompt
            .Replace("{{user_query}}", query)
            .Replace("{{context}}", context);
}