<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template name="team-list">
		<div class="team-list">
		<xsl:for-each select="./i">
			<div class="player-row">
				<span><xsl:value-of select="@pos" /></span>
				<span><xsl:value-of select="@name" /></span>
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

	<xsl:template name="team-formation">
		<xsl:variable name="team" select="."/>
		<xsl:for-each select="//Formations/form[@id = $team/@form]/i">
			<xsl:variable name="player" select="$team/i[@num = current()/@num]"/>
			<div class="player">
				<xsl:attribute name="style">--y: <xsl:value-of select="@y" />px; --x: <xsl:value-of select="@x" />px;</xsl:attribute>
				<span><xsl:value-of select="substring-after($player/@name, ' ')" /></span>
				<span><xsl:call-template name="abr-title">
					<xsl:with-param name="pos" select="$player/@pos" />
				</xsl:call-template></span>
			</div>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="abr-title">
		<xsl:param name="pos"/>
		<xsl:choose>
			<xsl:when test="$pos = 'G'">Goalkeeper</xsl:when>
			<xsl:when test="$pos = 'D'">Defender</xsl:when>
			<xsl:when test="$pos = 'LB'">Left Back</xsl:when>
			<xsl:when test="$pos = 'RB'">Right Back</xsl:when>
			<xsl:when test="$pos = 'LW'">Left Wing</xsl:when>
			<xsl:when test="$pos = 'RW'">Right Wing</xsl:when>
			<xsl:when test="$pos = 'M'">Midfielder</xsl:when>
			<xsl:when test="$pos = 'A'">Attacker</xsl:when>
			<xsl:otherwise>Player</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>