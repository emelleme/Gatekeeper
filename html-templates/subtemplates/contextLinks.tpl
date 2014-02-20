{load_templates subtemplates/keys.tpl}
{load_templates subtemplates/endpoints.tpl}

{template contextLink Context prefix='' suffix='' class=''}{strip}
    {if !$Context}
    	<em>[context deleted]</em>
    {elseif is_a($Context, 'Person')}
    	<a href="/people/{$Context->Handle}" class="{$class}">{$prefix}{$Context->FullNamePossessive|escape} Profile{$suffix}</a>
    {elseif is_a($Context, 'Media')}
    	<a href="{$Context->getThumbnailRequest(1000,1000)}" class="attached-media-link {$class}" title="{$Context->Caption|escape}">
    		{$prefix}
    		<img src="{$Context->getThumbnailRequest(25,25)}" alt="{$Context->Caption|escape}">
    		&nbsp;{$Context->Caption|escape}
    		{$suffix}
    	</a>
    {elseif is_a($Context, 'Ban')}
    	<a href="/bans/{$Context->Handle}" class="{$class}">{$prefix}Ban: {$Context->Title|escape}{$suffix}</a>
    {elseif is_a($Context, 'Key')}
        {apiKey $Context}
    {elseif is_a($Context, 'Endpoint')}
        {endpoint $Context}
    {else}
    	<a href="/{Router::getClassPath($Context)}/{tif $Context->Handle ? $Context->Handle : $Context->ID}" class="{$class}">{$Context->Title|escape}</a>
    {/if}
{/strip}{/template}