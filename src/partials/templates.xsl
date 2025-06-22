<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template name="team-list">
		<div class="team-list">
		<xsl:for-each select="./i">
			<div class="player-row">
				<span><xsl:value-of select="@name" /></span>
				<span><xsl:value-of select="@pos" /></span>
				<span><xsl:value-of select="@nat" /></span>
				<span><xsl:value-of select="@price" /></span>
				<span>
					<xsl:if test="@total">
						<xsl:value-of select="format-number((@total div 49) * 100, '##')" />%
					</xsl:if>
				</span>
			</div>
		</xsl:for-each>
		</div>

		<div class="team-total">
			<div class="summary-row">
				<span>Total</span>
				<span></span>
				<span></span>
				<span><xsl:value-of select="./tot/@price" /></span>
				<span><xsl:value-of select="format-number((./tot/@total div 49) * 100, '##')" />%</span>
			</div>
			<div class="summary-row">
				<span>Averge</span>
				<span></span>
				<span></span>
				<span><xsl:value-of select="./avg/@price" /></span>
				<span><xsl:value-of select="format-number((./avg/@total div 49) * 100, '##')" />%</span>
			</div>
		</div>
	</xsl:template>

</xsl:stylesheet>